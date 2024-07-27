import { IconBtn } from "@components/Button";
import UserContractDialog from "@components/UserContract/UserContractDialog/UserContractDialog";
import { UserContract, User } from "@core/graphql/types";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";

import { useState } from "react";

export default function EditUserContractBtn(props: {
  user: User;
  userContract?: UserContract;
}) {
  const { user, userContract } = props;
  const [shownEditDialog, setShownEditDialog] = useState(false);
  return (
    <>
      <IconBtn
        icon={<BorderColorOutlined />}
        onClick={() => setShownEditDialog(true)}
      />
      <UserContractDialog
        user={user}
        isOpenDialog={shownEditDialog}
        userContract={userContract}
        onClose={() => setShownEditDialog(false)}
        variant="edit"
      />
    </>
  );
}
