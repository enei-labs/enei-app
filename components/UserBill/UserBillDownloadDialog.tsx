import UserBill from "@components/UserBill/UserBill";
import { Fee, UserBill as UserBillType } from "@core/graphql/types";
import { Box, Button, Dialog } from "@mui/material";
import { useRef } from "react";
import { useReactToPrint } from "react-to-print";

interface UserBillDownloadDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  userBill: UserBillType;
  fee: Fee;
}

export function UserBillDownloadDialog(props: UserBillDownloadDialogProps) {
  const { isOpenDialog, onClose, userBill, fee } = props;
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
        <UserBill ref={componentRef} userBill={userBill} fee={fee} />
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
