import { PrintWrapper, ReadExcelInput } from "@components/ReadExcelInput";
import { IndustryBill, ElectricBillStatus } from "@core/graphql/types";
import { ReviewStatusLookup } from "@core/look-up/review-status";
import {
  Box,
  Dialog,
  Typography,
  Button,
  CircularProgress,
  ToggleButtonGroup,
  ToggleButton,
} from "@mui/material";
import { useIndustryBill } from "@utils/hooks/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useAuditIndustryBill, useRevertManualIndustryBill } from "@utils/hooks/mutations";
import { useSendIndustryBillEmail } from "@utils/hooks/mutations/useSendIndustryBillEmail";
import { toast } from "react-toastify";
import { CompanyBillTemplateData } from "@components/ElectricBill/CompanyBillTemplate";
import { DialogErrorBoundary } from "@components/ErrorBoundary";
import EmailIcon from "@mui/icons-material/Email";
import { ManualImportInfoCard } from "@components/ElectricBill/ManualImportInfoCard";
import { generateBillPdf } from "@utils/generateBillPdf";
import DialogAlert from "@components/DialogAlert";

interface IndustryBillDialogProps {
  isOpenDialog: boolean;
  onClose: () => void;
  industryBill: IndustryBill;
}

// 日期格式化
const formatBillingInfo = (billingDate: string) => {
  const date = new Date(billingDate);
  const year = date.getFullYear();
  const month = date.getMonth() + 1;

  const lastDay = new Date(year, month, 0).getDate();

  // 計算繳費通知單月份（計費月份的下個月，需處理跨年）
  const noticeYear = month === 12 ? year + 1 : year;
  const noticeMonth = month === 12 ? 1 : month + 1;

  return {
    billingMonth: `${noticeYear}年${noticeMonth}月`,
    billingDateRange: `${year}/${month}/1 - ${year}/${month}/${lastDay}`,
  };
};

// 操作模式：使用者在 UI 上的選擇
type OperationMode = 'review' | 'manual-import';

export const IndustryBillDialog = ({
  industryBill,
  isOpenDialog,
  onClose,
}: IndustryBillDialogProps) => {
  const { data, loading, error, refetch } = useIndustryBill(industryBill.id);
  const [auditIndustryBill, { loading: auditIndustryBillLoading }] =
    useAuditIndustryBill();
  const [sendIndustryBillEmail, { loading: sendingEmail }] = useSendIndustryBillEmail();
  const [revertManualIndustryBill, { loading: revertingManualImport }] = useRevertManualIndustryBill();

  // UI 操作模式（前端狀態）
  const [operationMode, setOperationMode] = useState<OperationMode>('review');

  // 電費單實際狀態（後端狀態）
  const [reviewStatus, setReviewStatus] = useState<ElectricBillStatus | null>(null);

  // 刪除手動匯入確認對話框狀態
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // 初始化電費單狀態
    if (data?.industryBill.status) {
      setReviewStatus(data.industryBill.status);
    }

    // 如果是手動匯入的電費單，預設顯示審核模式（因為已經是 APPROVED）
    if (data?.industryBill.billSource === 'MANUAL_IMPORT') {
      setOperationMode('review');
    }
  }, [data]);
  

  const industryBillTemplateData: CompanyBillTemplateData | null =
    useMemo(() => {
      if (!data || loading) return null;
      if (error) return null;

      const { billingMonth, billingDateRange } = formatBillingInfo(data.industryBill.billingDate);
      const amount = Math.round(data.industryBill.price * data.industryBill.transferDegree);
      const tax = Math.round(amount * 0.05);
      const totalIncludeTax = amount + tax;

      return {
        billingMonth: billingMonth,
        billingDate: billingDateRange,
        companyName: data.industryBill.industryBillConfig?.industry?.name ?? "",
        // 負責人名稱
        responsibleName:
          data.industryBill.industryBillConfig?.industry?.contactName ?? "",
        // 轉供單編號
        transferNumber: data.industryBill.transferDocumentNumber,
        // 電號
        serialNumber: data.industryBill.powerPlantNumber,
        // 電廠名稱
        powerPlantName: data.industryBill.powerPlantName,
        // 契約編號
        contractNumber: data.industryBill.companyContractNumber ?? "",
        // 基本資訊
        basicInfo: {
          // 併聯容量
          totalCapacity: data.industryBill.supplyVolume,
          // 轉供容量
          transferCapacity: data.industryBill.supplyVolume,
        },
        // 城市
        city: "",
        // 廠址
        address: data.industryBill.powerPlantAddress,
        // 電費計算
        billing: {
          // 轉供度數
          transferKwh: data.industryBill.transferDegree,
          // 費率
          price: data.industryBill.price,
          // 電費（未稅）
          amount: amount,
          // 營業稅 
          tax: tax,
          // 總金額
          totalIncludeTax: totalIncludeTax,
        },
      };
    }, [data, loading, error]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: data?.industryBill.name,
  });

  // 處理操作模式切換
  const handleModeChange = (
    event: React.MouseEvent<HTMLElement>,
    newMode: OperationMode | null
  ) => {
    if (!newMode) return;
    setOperationMode(newMode);
  };

  // 處理審核狀態變更（只在 review 模式下使用）
  const handleApprove = async () => {
    const variables = { id: industryBill.id, status: ElectricBillStatus.Approved };
    await auditIndustryBill({ variables });
    await refetch(); // 重新查詢以確保數據完整
    setReviewStatus(ElectricBillStatus.Approved);
    toast.success(`已調整審核狀態: ${ReviewStatusLookup[ElectricBillStatus.Approved]}`);
  };

  const handleSendEmail = async () => {
    try {
      // Generate PDF from the current bill template
      const { base64, fileName } = await generateBillPdf(
        componentRef,
        `industry_bill_${industryBill.id}_${new Date().getTime()}.pdf`
      );

      const { data: sendData } = await sendIndustryBillEmail({
        variables: {
          industryBillId: industryBill.id,
          pdfContent: base64,
          fileName: fileName,
        },
      });

      if (sendData?.sendIndustryBillEmail?.success) {
        toast.success(sendData.sendIndustryBillEmail.message || "電費單已成功寄出");
      } else {
        toast.error(sendData?.sendIndustryBillEmail?.message || "寄送失敗");
      }
    } catch (err) {
      console.error("Send email error:", err);
      toast.error("寄送電費單時發生錯誤");
    }
  };

  // 處理替換手動匯入（切換到手動匯入模式）
  const handleReplaceManualImport = () => {
    setOperationMode('manual-import');
  };

  // 處理刪除手動匯入確認
  const handleDeleteManualImport = () => {
    setShowDeleteConfirm(true);
  };

  // 確認刪除手動匯入
  const handleConfirmDeleteManualImport = async () => {
    try {
      const { data: revertData } = await revertManualIndustryBill({
        variables: {
          input: { industryBillId: industryBill.id },
        },
      });

      if (revertData?.revertManualIndustryBill) {
        toast.success("已刪除手動匯入，電費單狀態已變回「待審核」");
        setReviewStatus(ElectricBillStatus.Pending);
        await refetch();
      }
    } catch (err) {
      console.error("Revert manual import error:", err);
      toast.error("刪除手動匯入時發生錯誤");
    } finally {
      setShowDeleteConfirm(false);
    }
  };

  return (
    <>
    <Dialog open={isOpenDialog} onClose={onClose} maxWidth="md">
      <DialogErrorBoundary onClose={onClose}>
        <Box padding="36px">
          <Typography textAlign={"left"} variant="h4">
            發電業電費單
          </Typography>
          <Typography textAlign={"left"} variant="h6">
            電費單組合： {industryBill.industryBillConfig?.name ?? ""}
          </Typography>

          {/* 手動匯入資訊卡片（含 PDF 預覽） */}
          {data?.industryBill && (
            <ManualImportInfoCard
              billSource={data.industryBill.billSource ?? null}
              originalFileDownloadUrl={data.industryBill.originalFileDownloadUrl}
              generatedPdfDownloadUrl={data.industryBill.generatedPdfDownloadUrl}
              importedBy={data.industryBill.importedBy?.name ?? null}
              importedAt={data.industryBill.importedAt}
              onReplace={handleReplaceManualImport}
              onDelete={handleDeleteManualImport}
              isDeleting={revertingManualImport}
            />
          )}

          {/* 系統計算的電費單區塊 */}
          {data?.industryBill.billSource === 'MANUAL_IMPORT' && (
            <Typography variant="h6" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
              📊 系統計算的電費單（參考用）
            </Typography>
          )}

          {!industryBillTemplateData ? (
            <Box
              display="flex"
              justifyContent="center"
              alignItems="center"
              height="100%"
            >
              <CircularProgress />
            </Box>
          ) : (
            <PrintWrapper
              ref={componentRef}
              userBillTemplatesData={[]}
              companyBillTemplatesData={[industryBillTemplateData]}
            />
          )}

          {reviewStatus && (
            <Box sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center" }}>
              <Typography>當前審核狀態：</Typography>
              {auditIndustryBillLoading ? (
                <CircularProgress size="16px" />
              ) : (
                <Typography>{ReviewStatusLookup[reviewStatus]}</Typography>
              )}
            </Box>
          )}

          {/* 操作模式選擇：審核 vs 手動匯入 */}
          <Box sx={{ mt: 3, mb: 2 }}>
            <Typography variant="subtitle2" sx={{ mb: 1 }}>
              選擇操作方式：
            </Typography>
            <ToggleButtonGroup
              value={operationMode}
              exclusive
              onChange={handleModeChange}
              aria-label="操作方式"
              fullWidth
            >
              <ToggleButton
                value="review"
                aria-label="審核電費單"
              >
                審核電費單
              </ToggleButton>
              <ToggleButton
                value="manual-import"
                aria-label="手動匯入"
              >
                手動匯入
              </ToggleButton>
            </ToggleButtonGroup>
          </Box>

          {/* 審核模式 */}
          {operationMode === 'review' && (
            <Box display="flex" justifyContent="flex-end" gap={2}>
              {reviewStatus !== ElectricBillStatus.Approved && (
                <Button
                  variant="contained"
                  color="success"
                  onClick={handleApprove}
                  disabled={auditIndustryBillLoading}
                >
                  {auditIndustryBillLoading ? <CircularProgress size={20} /> : "審核通過"}
                </Button>
              )}
              {reviewStatus === ElectricBillStatus.Approved && (
                <>
                  <Button variant="contained" color="primary" onClick={handlePrint}>
                    列印
                  </Button>
                  <Button
                    variant="contained"
                    color="secondary"
                    onClick={handleSendEmail}
                    disabled={sendingEmail}
                    startIcon={sendingEmail ? <CircularProgress size={20} /> : <EmailIcon />}
                  >
                    {sendingEmail ? "寄送中..." : "寄送電費單"}
                  </Button>
                </>
              )}
            </Box>
          )}

          {/* 手動匯入模式 */}
          {operationMode === 'manual-import' && (
            <Box sx={{ mt: 3 }}>
              <ReadExcelInput singleTabMode={true} />
            </Box>
          )}
        </Box>
      </DialogErrorBoundary>
    </Dialog>

    {/* 刪除手動匯入確認對話框 - 放在主 Dialog 外面避免事件衝突 */}
    <DialogAlert
      open={showDeleteConfirm}
      title="刪除手動匯入電費單"
      content="確定要刪除手動匯入的資料嗎？電費單狀態將變回「待審核」。"
      onConfirm={handleConfirmDeleteManualImport}
      onClose={() => setShowDeleteConfirm(false)}
    />
    </>
  );
};
