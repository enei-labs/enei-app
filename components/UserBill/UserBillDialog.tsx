import { UserBillTemplateData } from "@components/ElectricBill/UserBillTemplate";
import { PrintWrapper, ReadExcelInput } from "@components/ReadExcelInput";
import { UserBill, ElectricBillStatus, UserBillConfigChargeType, Fee } from "@core/graphql/types";
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
import { useUserBill } from "@utils/hooks/queries";
import { useEffect, useMemo, useRef, useState } from "react";
import { useReactToPrint } from "react-to-print";
import { useAuditUserBill } from "@utils/hooks/mutations";
import { useSendUserBillEmail } from "@utils/hooks/mutations/useSendUserBillEmail";
import { toast } from "react-toastify";
import { DialogErrorBoundary } from "@components/ErrorBoundary";
import EmailIcon from "@mui/icons-material/Email";
import { ManualImportInfoCard } from "@components/ElectricBill/ManualImportInfoCard";
import { generateBillPdf } from "@utils/generateBillPdf";

// 操作模式：使用者在 UI 上的選擇
type OperationMode = 'review' | 'manual-import';

interface UserBillDialogProps {
  isOpenDialog: boolean;
  onClose: () => void;
  userBill: UserBill;
}

// 計算工具函數
const calculateTotalDegree = (electricNumberInfos: UserBill["electricNumberInfos"]) => 
  electricNumberInfos.reduce((acc, info) => acc + (info.degree ?? 0), 0);

// 費用計算邏輯
const calculateFees = (
  electricNumberInfos: UserBill["electricNumberInfos"],
  userBillConfig: UserBill["userBillConfig"],
  fee: Fee
) => {
  const totalDegree = calculateTotalDegree(electricNumberInfos);
  
  const shouldCalculate = {
    substitution: userBillConfig?.transportationFee === UserBillConfigChargeType.User,
    verification: userBillConfig?.credentialInspectionFee === UserBillConfigChargeType.User,
    service: userBillConfig?.credentialServiceFee === UserBillConfigChargeType.User,
  };

  const feeRates = {
    substitution: Number(fee.substitutionFee),
    verification: Number(fee.certificateVerificationFee),
    service: Number(fee.certificateServiceFee),
  };

  // 代輸費計算
  const substitutionFee = shouldCalculate.substitution 
    ? Math.round(electricNumberInfos.reduce((acc, info) => acc + (info.fee ?? 0), 0) / 1.05)
    : 0;

  // 憑證審查費計算
  const certificationFee = shouldCalculate.verification 
    ? Math.round(totalDegree * feeRates.verification)
    : 0;
  
  // 憑證服務費計算
  const certificationServiceFee = shouldCalculate.service 
    ? Math.round(totalDegree * feeRates.service)
    : 0;

  return {
    substitutionFee,
    certificationFee,
    certificationServiceFee,
    totalFee: Math.round(substitutionFee + certificationFee + certificationServiceFee),
  };
};

// 稅費計算
const calculateTaxAndTotal = (totalAmount: number, totalFee: number) => {
  const total = totalAmount + totalFee;
  const tax = Math.round(total * 0.05);
  const totalIncludeTax = total + tax;

  return { total, tax, totalIncludeTax };
};

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
  const { data, loading, error } = useUserBill(userBill.id);
  const [auditUserBill, { loading: auditUserBillLoading }] = useAuditUserBill();
  const [sendUserBillEmail, { loading: sendingEmail }] = useSendUserBillEmail();

  // UI 操作模式（前端狀態）
  const [operationMode, setOperationMode] = useState<OperationMode>('review');

  // 電費單實際狀態（後端狀態）
  const [reviewStatus, setReviewStatus] = useState<ElectricBillStatus | null>(null);

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
    
    // 基礎計算
    const totalDegree = calculateTotalDegree(bill.electricNumberInfos);
    const usage = bill.electricNumberInfos.map((info) => ({
      serialNumber: info.number ?? "",
      kwh: info.degree,
      price: info.price ?? 0,
      amount: Math.round((info.price ?? 0) * (info.degree ?? 0)),
    }));
    const totalAmount = usage.reduce((acc, info) => acc + info.amount, 0);
    
    // 費用計算
    const fees = calculateFees(bill.electricNumberInfos, bill.userBillConfig, fee);
    
    // 稅費計算
    const { total, tax, totalIncludeTax } = calculateTaxAndTotal(totalAmount, fees.totalFee);
    
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
      totalFee: fees.totalFee,
      total,
      tax,
      totalIncludeTax,
      usage: bill.electricNumberInfos.map((info) => ({
        serialNumber: info.number ?? "",
        kwh: info.degree,
        price: info.price ?? 0,
        amount: (info.price ?? 0) * (info.degree ?? 0),
      })),
      substitutionFee: fees.substitutionFee,
      certificationFee: fees.certificationFee,
      certificationServiceFee: fees.certificationServiceFee,
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

  return (
    <Dialog open={isOpenDialog} onClose={onClose} maxWidth="md">
      <DialogErrorBoundary onClose={onClose}>
        <Box padding="36px">
        <Typography textAlign={"left"} variant="h4">
          用戶電費單
        </Typography>
        <Typography textAlign={"left"} variant="h6">
          電費單組合： {data?.userBill.userBillConfig?.name ?? ""}
        </Typography>

        {/* 手動匯入資訊卡片 */}
        {data?.userBill && (
          <ManualImportInfoCard
            billSource={data.userBill.billSource ?? null}
            originalFileDownloadUrl={data.userBill.originalFileDownloadUrl}
            importedBy={data.userBill.importedBy?.name ?? null}
            importedAt={data.userBill.importedAt}
          />
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
          <Box sx={{ mt: 3 }}>
            <ReadExcelInput singleTabMode={true} />
          </Box>
        )}
        </Box>
      </DialogErrorBoundary>
    </Dialog>
  );
};
