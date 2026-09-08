import { UserBillTemplateData } from "@components/ElectricBill/UserBillTemplate";
import { PrintWrapper, ReadExcelInput } from "@components/ReadExcelInput";
import { UserBill, ElectricBillStatus, UserBillConfigChargeType } from "@core/graphql/types";
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
import { formatDateTime } from "@utils/format";
import { calcUserBillCharges } from "@utils/bill-calculation";
import { useUserBill } from "@utils/hooks/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useAuditUserBill, useRevertManualUserBill } from "@utils/hooks/mutations";
import { useSendUserBillEmail } from "@utils/hooks/mutations/useSendUserBillEmail";
import { toast } from "react-toastify";
import { DialogErrorBoundary } from "@components/ErrorBoundary";
import EmailIcon from "@mui/icons-material/Email";
import { ManualImportInfoCard } from "@components/ElectricBill/ManualImportInfoCard";
import { generateBillPdf } from "@utils/generateBillPdf";
import DialogAlert from "@components/DialogAlert";

// 操作模式：使用者在 UI 上的選擇
type OperationMode = 'review' | 'manual-import';

interface UserBillDialogProps {
  isOpenDialog: boolean;
  onClose: () => void;
  userBill: UserBill;
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

export const UserBillDialog = ({
  userBill,
  isOpenDialog,
  onClose,
}: UserBillDialogProps) => {
  const { data, loading, error, refetch } = useUserBill(userBill.id);
  const [auditUserBill, { loading: auditUserBillLoading }] = useAuditUserBill();
  const [sendUserBillEmail, { loading: sendingEmail }] = useSendUserBillEmail();
  const [revertManualUserBill, { loading: revertingManualImport }] = useRevertManualUserBill();

  // UI 操作模式（前端狀態）
  const [operationMode, setOperationMode] = useState<OperationMode>('review');

  // 手動匯入區塊的 ref（用於滾動）
  const manualImportSectionRef = useRef<HTMLDivElement>(null);

  // 電費單實際狀態（後端狀態）
  const [reviewStatus, setReviewStatus] = useState<ElectricBillStatus | null>(null);

  // 刪除手動匯入確認對話框狀態
  const [showDeleteConfirm, setShowDeleteConfirm] = useState(false);

  useEffect(() => {
    // 初始化電費單狀態
    if (data?.userBill.status) {
      setReviewStatus(data.userBill.status);
    }

    // 如果是手動匯入的電費單，預設顯示審核模式（因為已經是 APPROVED）
    if (data?.userBill.billSource === 'MANUAL_IMPORT') {
      setOperationMode('review');
    }
  }, [data]);

  const userBillTemplateData: UserBillTemplateData | null = useMemo(() => {
    if (!data || loading || error) return null;

    const { userBill: bill, fee } = data;

    // 電費、規費、稅費計算（唯一實作見 utils/bill-calculation.ts）
    const infos = bill.electricNumberInfos ?? [];
    const charges = calcUserBillCharges(
      infos,
      {
        chargeSubstitutionFee: bill.userBillConfig?.transportationFee === UserBillConfigChargeType.User,
        chargeCertificationFee: bill.userBillConfig?.credentialInspectionFee === UserBillConfigChargeType.User,
        chargeCertificationServiceFee: bill.userBillConfig?.credentialServiceFee === UserBillConfigChargeType.User,
      },
      {
        certificateVerificationFee: Number(fee.certificateVerificationFee),
        certificateServiceFee: Number(fee.certificateServiceFee),
      }
    );
    const { totalKwh: totalDegree, totalAmount, total, tax, totalIncludeTax } = charges;

    // 日期格式化
    const { billingMonth, billingDateRange } = formatBillingInfo(bill.billingDate);

    return {
      billingMonth,
      billingDate: billingDateRange,
      companyName: bill.userBillConfig?.user.name ?? "",
      customerName: bill.userBillConfig?.user.contactName ?? "",
      customerNumber: bill.transferDocumentNumbers.join("、"),
      address: bill.userBillConfig?.user.companyAddress ?? "",
      amount: total,
      dueDate: formatDateTime(
        new Date(
          Date.now() +
            (bill.userBillConfig?.paymentDeadline ?? 0) * 24 * 60 * 60 * 1000
        )
      ),
      bank: {
        bankName: bill.userBillConfig?.recipientAccount
          ? [
              bill.userBillConfig.recipientAccount.bankCode,
              bill.userBillConfig.recipientAccount.bankName,
              bill.userBillConfig.recipientAccount.bankBranchCode,
              bill.userBillConfig.recipientAccount.bankBranchName,
            ].filter(Boolean).join(' ')
          : "",
        accountName: bill.userBillConfig?.user.bankAccounts?.[0]?.accountName ?? "",
        accountNumber: bill.userBillConfig?.recipientAccount?.account ?? "",
      },
      totalKwh: totalDegree,
      totalAmount,
      totalFee: charges.totalFee,
      total,
      tax,
      totalIncludeTax,
      usage: bill.electricNumberInfos.map((info) => ({
        serialNumber: info.number ?? "",
        kwh: info.degree,
        price: info.price ?? 0,
        amount: (info.price ?? 0) * (info.degree ?? 0),
      })),
      substitutionFee: charges.substitutionFee,
      certificationFee: charges.certificationFee,
      certificationServiceFee: charges.certificationServiceFee,
    };
  }, [data, loading, error]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: data?.userBill.name ?? userBill.name,
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
    const variables = { id: userBill.id, status: ElectricBillStatus.Approved };
    await auditUserBill({ variables });
    await refetch(); // 重新查詢以確保數據完整
    setReviewStatus(ElectricBillStatus.Approved);
    toast.success(`已調整審核狀態: ${ReviewStatusLookup[ElectricBillStatus.Approved]}`);
  };


  const handleSendEmail = async () => {
    try {
      // Generate PDF from the current bill template
      const { base64, fileName } = await generateBillPdf(
        componentRef,
        `user_bill_${userBill.id}_${new Date().getTime()}.pdf`
      );

      const { data: sendData } = await sendUserBillEmail({
        variables: {
          userBillId: userBill.id,
          pdfContent: base64,
          fileName: fileName,
        },
      });

      if (sendData?.sendUserBillEmail?.success) {
        toast.success(sendData.sendUserBillEmail.message || "電費單已成功寄出");
      } else {
        toast.error(sendData?.sendUserBillEmail?.message || "寄送失敗");
      }
    } catch (err) {
      console.error("Send email error:", err);
      toast.error("寄送電費單時發生錯誤");
    }
  };

  // 處理替換手動匯入（切換到手動匯入模式並滾動到上傳區域）
  const handleReplaceManualImport = () => {
    setOperationMode('manual-import');
    // 使用 setTimeout 確保 DOM 更新後再滾動
    setTimeout(() => {
      manualImportSectionRef.current?.scrollIntoView({ behavior: 'smooth', block: 'center' });
    }, 100);
  };

  // 處理刪除手動匯入確認
  const handleDeleteManualImport = () => {
    setShowDeleteConfirm(true);
  };

  // 確認刪除手動匯入
  const handleConfirmDeleteManualImport = async () => {
    try {
      const { data: revertData } = await revertManualUserBill({
        variables: {
          input: { userBillId: userBill.id },
        },
      });

      if (revertData?.revertManualUserBill) {
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
          用戶電費單
        </Typography>
        <Typography textAlign={"left"} variant="h6">
          電費單組合： {data?.userBill.userBillConfig?.name ?? ""}
        </Typography>

        {/* 手動匯入資訊卡片（含 PDF 預覽） */}
        {data?.userBill && (
          <ManualImportInfoCard
            billSource={data.userBill.billSource ?? null}
            originalFileDownloadUrl={data.userBill.originalFileDownloadUrl}
            generatedPdfDownloadUrl={data.userBill.generatedPdfDownloadUrl}
            importedBy={data.userBill.importedBy?.name ?? null}
            importedAt={data.userBill.importedAt}
            onReplace={handleReplaceManualImport}
            onDelete={handleDeleteManualImport}
            isDeleting={revertingManualImport}
          />
        )}

        {/* 系統計算的電費單區塊 */}
        {data?.userBill.billSource === 'MANUAL_IMPORT' && (
          <Typography variant="h6" sx={{ mt: 3, mb: 1, display: 'flex', alignItems: 'center', gap: 1 }}>
            📊 系統計算的電費單（參考用）
          </Typography>
        )}

        {!userBillTemplateData ? (
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
            userBillTemplatesData={[userBillTemplateData]}
            companyBillTemplatesData={[]}
          />
        )}

        {reviewStatus && (
          <Box sx={{ mt: 3, mb: 2, display: "flex", alignItems: "center" }}>
            <Typography>當前審核狀態：</Typography>
            {auditUserBillLoading ? (
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
                disabled={auditUserBillLoading}
              >
                {auditUserBillLoading ? <CircularProgress size={20} /> : "審核通過"}
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
          <Box sx={{ mt: 3 }} ref={manualImportSectionRef}>
            <ReadExcelInput singleTabMode={true} onImportSuccess={refetch} />
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
