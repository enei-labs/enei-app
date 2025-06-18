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
import { toast } from "react-toastify";

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
  
  return {
    billingMonth: `${year}年${month + 1}月`,
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
  const [reviewStatus, setReviewStatus] = useState<ElectricBillStatus | null>(
    null
  );

  useEffect(() => {
    if (data?.userBill.status === ElectricBillStatus.Approved) {
      setReviewStatus(ElectricBillStatus.Approved);
    }

    if (data?.userBill.status === ElectricBillStatus.Manual) {
      setReviewStatus(ElectricBillStatus.Manual);
    }

    if (data?.userBill.status === ElectricBillStatus.Pending) {
      setReviewStatus(ElectricBillStatus.Pending);
    }

    if (data?.userBill.status === ElectricBillStatus.Rejected) {
      setReviewStatus(ElectricBillStatus.Rejected);
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
      amount: (info.price ?? 0) * (info.degree ?? 0),
    }));
    const totalAmount = Math.round(usage.reduce((acc, info) => acc + info.amount, 0));
    
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
        bankName: bill.userBillConfig?.recipientAccount.bankCode ?? "",
        accountName: bill.userBillConfig?.user.bankAccounts?.[0]?.accountName ?? "",
        accountNumber: bill.userBillConfig?.user.bankAccounts?.[0]?.account ?? "",
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
    documentTitle: userBill.name,
  });

  const handleReviewChange = async (
    event: React.MouseEvent<HTMLElement>,
    newStatus: ElectricBillStatus | null
  ) => {
    if (!newStatus) return;
    const variables = { id: userBill.id, status: newStatus };

    await auditUserBill({ variables });
    setReviewStatus(newStatus);
    switch (newStatus) {
      case ElectricBillStatus.Approved:
        toast.success(`已調整審核狀態: ${ReviewStatusLookup[newStatus]}`);
        break;
      case ElectricBillStatus.Manual:
        toast.success(`已調整審核狀態: ${ReviewStatusLookup[newStatus]}`);
        break;
    }
  };

  const handleManualImport = () => {
    // TODO: 實作手動匯入邏輯
    onClose();
  };

  return (
    <Dialog open={isOpenDialog} onClose={onClose} maxWidth="md">
      <Box padding="36px">
        <Typography textAlign={"left"} variant="h4">
          用戶電費單
        </Typography>
        <Typography textAlign={"left"} variant="h6">
          電費單組合： {userBill.userBillConfig?.name ?? ""}
        </Typography>
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

        <Box sx={{ mt: 3, mb: 2 }}>
          <ToggleButtonGroup
            value={reviewStatus}
            exclusive
            onChange={handleReviewChange}
            aria-label="審核狀態"
            fullWidth
          >
            <ToggleButton
              value={ElectricBillStatus.Approved}
              aria-label="審核通過"
            >
              審核通過
            </ToggleButton>
            <ToggleButton
              value={ElectricBillStatus.Manual}
              aria-label="選擇手動輸入"
            >
              選擇手動輸入
            </ToggleButton>
          </ToggleButtonGroup>
        </Box>

        <Box display="flex" justifyContent="flex-start" gap={2}>
          {reviewStatus === ElectricBillStatus.Approved && (
            <Button variant="contained" color="primary" onClick={handlePrint}>
              列印
            </Button>
          )}
        </Box>
        {reviewStatus === ElectricBillStatus.Manual && <ReadExcelInput />}
      </Box>
    </Dialog>
  );
};
