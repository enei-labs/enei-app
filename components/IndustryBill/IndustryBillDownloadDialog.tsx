import IndustryBill from "@components/IndustryBill/IndustryBill";
import { Fee, IndustryBill as IndustryBillType } from "@core/graphql/types";
import { Box, Button, Dialog } from "@mui/material";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface IndustryBillDownloadDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  industryBill: IndustryBillType;
  fee: Fee;
}

export function IndustryBillDownloadDialog(props: IndustryBillDownloadDialogProps) {
  const { isOpenDialog, onClose, industryBill, fee } = props;
  const componentRef = useRef(null);
  const handlePrint = useReactToPrint({
    content: () => componentRef.current,
  });

  return (
    <Dialog
      open={isOpenDialog}
      onClose={onClose}
      sx={{
        "& .MuiDialog-paper": {
          maxWidth: 800,
        },
      }}
    >
      <Box sx={{ backgroundColor: "primary.light", padding: "32px 24px" }}>
        <IndustryBill ref={componentRef} industryBill={industryBill} fee={fee} />
        <Box
          sx={{
            display: "flex",
            justifyContent: "flex-end",
            marginTop: "8px",
          }}
        >
          <Button onClick={handlePrint}>匯出 PDF</Button>
        </Box>
      </Box>
    </Dialog>
  );
}
