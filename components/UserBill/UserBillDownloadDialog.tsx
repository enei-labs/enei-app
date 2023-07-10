import { UserBill } from "@components/UserBill/UserBill";
import { Fee, UserBill as UserBillType } from "@core/graphql/types";
import { Box, Dialog } from "@mui/material";

interface UserBillDownloadDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  userBill: UserBillType;
  fee: Fee;
}

export function UserBillDownloadDialog(props: UserBillDownloadDialogProps) {
  const { isOpenDialog, onClose, userBill, fee } = props;
  return (
    <Dialog open={isOpenDialog} onClose={onClose} sx={{           
      '& .MuiDialog-paper': {
      maxWidth: 800,
    } }}>
      <Box sx={{ backgroundColor: "primary.light", padding: '32px 24px',}}>
        <UserBill userBill={userBill} fee={fee} />
      </Box>
    </Dialog>
  );
}
