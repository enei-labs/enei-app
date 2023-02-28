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
  closeDialog: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const EditAccountBtns = (props: EditAccountBtnsProps) => {
  const { id, closeDialog, handleSubmit } = props;
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

    if (data && data.modifyAccount.__typename === "Success") {
      toast.success("Success");
      closeDialog();
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
        onClick={closeDialog}
      >
        取消
      </Button>
    </>
  );
};

export default EditAccountBtns;
