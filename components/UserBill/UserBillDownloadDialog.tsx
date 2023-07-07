import { UserBill } from "@components/UserBill/UserBill";
import { UserBill as UserBillType } from "@core/graphql/types";
import { Dialog } from "@mui/material";

interface UserBillDownloadDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  userBill: UserBillType;
}

export function UserBillDownloadDialog(props: UserBillDownloadDialogProps) {
  const { isOpenDialog, onClose, userBill } = props;
  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <UserBill userBill={userBill} />
    </Dialog>
  );
}
