import { UserBillTemplateData } from "@components/ElectricBill/UserBillTemplate";
import { PrintWrapper } from "@components/ReadExcelInput";
import { UserBill } from "@core/graphql/types";
import { Box, Dialog, Typography, Button } from "@mui/material";
import { useRef } from "react";
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
  const userBillTemplateData: UserBillTemplateData = {
    billingMonth: `${new Date(userBill.billingDate).getFullYear()}年${new Date(userBill.billingDate).getMonth() + 1}月`,
    /** @TODO */
    billingDate: "",
    companyName: userBill.userBillConfig?.user.name || "",
    customerName: userBill.userBillConfig?.user.contactName || "",
    customerNumber: userBill.userBillConfig?.user.name || "",
    address: userBill.userBillConfig?.user.companyAddress || "",
    amount: 0,
    dueDate: "",
    bank: {
      bankName: "",
      accountName: "",
      accountNumber: "",
    },
    totalKwh: 0,
    totalAmount: 0,
    totalFee: 0,
    total: 0,
    tax: 0,
    totalIncludeTax: 0,
    usage: [],
    substitutionFee: 0,
    certificationFee: 0,
    certificationServiceFee: 0,
  };

  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
    documentTitle: `${userBill.name}`,
  });

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <Box padding="36px">
        <Typography textAlign={"left"} variant="h4">
          用戶電費單
        </Typography>
        <PrintWrapper
          ref={componentRef}
          userBillTemplatesData={[userBillTemplateData]}
          companyBillTemplatesData={[]}
        />
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
