import { UserBillTemplateData } from "@components/ElectricBill/UserBillTemplate";
import { PrintWrapper, ReadExcelInput } from "@components/ReadExcelInput";
import { UserBill, ElectricBillStatus } from "@core/graphql/types";
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

  const calculateTotalDegree = (
    electricNumberInfos: UserBill["electricNumberInfos"]
  ) => electricNumberInfos.reduce((acc, info) => acc + (info.degree ?? 0), 0);

  const calculateTotalAmount = (
    electricNumberInfos: UserBill["electricNumberInfos"]
  ) =>
    electricNumberInfos.reduce(
      (acc, info) => acc + (info.price ?? 0) * (info.degree ?? 0),
      0
    );

  const userBillTemplateData: UserBillTemplateData | null = useMemo(() => {
    if (!data || loading) return null;
    if (error) return null;

    const totalDegree = calculateTotalDegree(data.userBill.electricNumberInfos);

    const feeRates = {
      substitution: Number(data.fee.substitutionFee),
      verification: Number(data.fee.certificateVerificationFee),
      service: Number(data.fee.certificateServiceFee),
    };
    const substitutionFee = Math.round(
      (totalDegree * feeRates.substitution) / 1.05
    );
    const certificationFee = Math.round(totalDegree * feeRates.verification);
    const certificationServiceFee = Math.round(totalDegree * feeRates.service);

    const totalFee =
      substitutionFee + certificationFee + certificationServiceFee;

    const totalAmount = calculateTotalAmount(data.userBill.electricNumberInfos);
    const tax = (totalAmount + totalFee) * 0.05;

    return {
      // 計費年月： 「新增台電代輸繳費單」「計費年月」+1個月
      billingMonth: `${new Date(data.userBill.billingDate).getFullYear()}年${
        new Date(data.userBill.billingDate).getMonth() + 1 + 1
      }月`,
      // 計費期間： 「新增台電代輸繳費單」「計費年月」的起訖日
      billingDate: `${new Date(data.userBill.billingDate).getFullYear()}/${
        new Date(data.userBill.billingDate).getMonth() + 1
      }/1 - ${new Date(data.userBill.billingDate).getFullYear()}/${
        new Date(data.userBill.billingDate).getMonth() + 1
      }/${new Date(new Date(data.userBill.billingDate).getFullYear(), new Date(data.userBill.billingDate).getMonth() + 1, 0).getDate()}`,
      companyName: data.userBill.userBillConfig?.user.name ?? "",
      customerName: data.userBill.userBillConfig?.user.contactName ?? "",
      // 「計費年月」在「新增台電代輸繳費單」中的所有「轉供契約編號」
      customerNumber: data.userBill.transferDocumentNumbers.join("、"),
      address: data.userBill.userBillConfig?.user.companyAddress ?? "",
      amount: totalAmount + totalFee,
      dueDate: formatDateTime(
        new Date(
          Date.now() +
            (data.userBill.userBillConfig?.paymentDeadline ?? 0) *
              24 *
              60 *
              60 *
              1000
        )
      ),
      bank: {
        bankName: data.userBill.userBillConfig?.recipientAccount.bankCode ?? "",
        accountName:
          data.userBill.userBillConfig?.user.bankAccounts?.[0]?.accountName ??
          "",
        accountNumber:
          data.userBill.userBillConfig?.user.bankAccounts?.[0]?.account ?? "",
      },
      totalKwh: totalDegree,
      totalAmount,
      totalFee,
      total: totalAmount + totalFee,
      tax,
      totalIncludeTax: totalAmount + totalFee + tax,
      usage: data.userBill.electricNumberInfos.map((info) => ({
        serialNumber: info.number ?? "",
        kwh: info.degree,
        price: info.price ?? 0,
        amount: (info.price ?? 0) * (info.degree ?? 0),
      })),
      substitutionFee,
      certificationFee,
      certificationServiceFee,
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
