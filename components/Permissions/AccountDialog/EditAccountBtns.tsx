import { Button } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { CancelOutlined } from "@mui/icons-material";
import { useModifyAccount } from "@utils/hooks";
import { LoadingButton } from "@mui/lab";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { ACCOUNTS } from "@core/graphql/queries";
import { toast } from "react-toastify";

interface EditAccountBtnsProps {
  id: string;
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const EditAccountBtns = (props: EditAccountBtnsProps) => {
  const { id, onClose, handleSubmit } = props;
  const [modifyAccount, { loading }] = useModifyAccount();

  const onModifyAccount = async (formData: FormData) => {
    const { name, email, companyId } = formData;
    const { data } = await modifyAccount({
      variables: {
        name: name,
        email: email,
        companyId: companyId?.value || undefined,
        id,
      },
      refetchQueries: [ACCOUNTS],
    });

    if (data) {
      toast.success("更新成功");
      onClose();
    }
  };

  return (
    <>
      <LoadingButton
        loading={loading}
        startIcon={<SaveOutlinedIcon />}
        onClick={handleSubmit(onModifyAccount)}
      >
        儲存
      </LoadingButton>
      <Button
        startIcon={<CancelOutlined />}
        sx={{
          "&.MuiButton-text": {
            backgroundColor: "transparent",
            background: "primary.dark",
            color: "primary.dark",
          },
          ".MuiButton-startIcon": {
            svg: {
              color: "primary.dark",
            },
          },
        }}
        onClick={onClose}
      >
        取消
      </Button>
    </>
  );
};

export default EditAccountBtns;
