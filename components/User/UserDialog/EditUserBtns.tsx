import { Button } from "@mui/material";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { CancelOutlined } from "@mui/icons-material";
import { useModifyUser } from "@utils/hooks";
import { LoadingButton } from "@mui/lab";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { Users } from "@core/graphql/queries";
import { toast } from "react-toastify";

interface EditUserBtnsProps {
  id: string;
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const EditUserBtns = (props: EditUserBtnsProps) => {
  const { id, onClose, handleSubmit } = props;
  const [modifyUser, { loading }] = useModifyUser();

  const onModifyUser = async (formData: FormData) => {
    const { data } = await modifyUser({
      variables: {
        id: id,
        input: {
          name: formData.name,
          companyAddress: formData.companyAddress,
          notes: formData.notes,
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          bankAccounts: formData.bankAccounts,
        },
      },
      refetchQueries: [Users],
    });

    if (data && data.modifyUser.__typename === "User") {
      toast.success("Success");
      onClose();
    }
  };

  return (
    <>
      <LoadingButton
        loading={loading}
        startIcon={<SaveOutlinedIcon />}
        onClick={handleSubmit(onModifyUser)}
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

export default EditUserBtns;
