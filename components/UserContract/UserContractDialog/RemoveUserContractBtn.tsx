import { IconBtn } from "@components/Button";
import DialogAlert from "@components/DialogAlert";
import { UserContract } from "@core/graphql/types";
import { DeleteOutlined } from "@mui/icons-material";
import { useRemoveUserContract } from "@utils/hooks/mutations/useRemoveUserContract";

import { useState } from "react";
import { toast } from "react-toastify";

export default function RemoveUserContractBtn(props: {
  userContract?: UserContract;
  userId: string;
}) {
  const { userContract, userId } = props;
  const [shownRemoveDialog, setShownRemoveDialog] = useState(false);
  const [removeUserContract] = useRemoveUserContract(userId);
  return (
    <>
      <IconBtn
        icon={<DeleteOutlined />}
        onClick={() => {
          setShownRemoveDialog(true);
        }}
      />
      {shownRemoveDialog && userContract ? (
        <DialogAlert
          open={shownRemoveDialog}
          title={"刪除契約"}
          content={"是否確認要刪除契約？"}
          onConfirm={() => {
            removeUserContract({
              variables: { id: userContract.id },
              onCompleted: () => {
                toast.success("刪除成功");
                setShownRemoveDialog(false);
              },
            });
          }}
          onClose={() => setShownRemoveDialog(false)}
        />
      ) : null}
    </>
  );
}
