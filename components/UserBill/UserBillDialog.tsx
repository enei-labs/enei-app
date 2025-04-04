import { UserBillTemplateData } from "@components/ElectricBill/UserBillTemplate";
import { PrintWrapper } from "@components/ReadExcelInput";
import { UserBill } from "@core/graphql/types";
import {
  Box,
  Dialog,
  Typography,
  Button,
  CircularProgress,
} from "@mui/material";
import { formatDateTime } from "@utils/format";
import { useUserBill } from "@utils/hooks/queries";
import { useMemo, useRef } from "react";
import { useReactToPrint } from "react-to-print";

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

    const totalFee =
      totalDegree *
      (feeRates.substitution + feeRates.verification + feeRates.service);
    const totalAmount =
      calculateTotalAmount(data.userBill.electricNumberInfos) + totalFee;
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
      amount: totalAmount + totalFee - tax,
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
      totalIncludeTax: totalAmount + totalFee - tax,
      usage: data.userBill.electricNumberInfos.map((info) => ({
        serialNumber: info.number ?? "",
        kwh: info.degree,
        price: info.price ?? 0,
        amount: (info.price ?? 0) * (info.degree ?? 0),
      })),
      substitutionFee: totalDegree * feeRates.substitution,
      certificationFee: totalDegree * feeRates.verification,
      certificationServiceFee: totalDegree * feeRates.service,
    };
  }, [data, loading, error]);

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: userBill.name,
  });

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
        <Box display="flex" justifyContent="flex-end" gap={2}>
          <Button onClick={() => {}} sx={{ marginRight: "6px" }}>
            審核
          </Button>

          <Button onClick={handlePrint} sx={{ marginRight: "6px" }}>
            列印
          </Button>
        </Box>
      </Box>
    </Dialog>
  );
};
