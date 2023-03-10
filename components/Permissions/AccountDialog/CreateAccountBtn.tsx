import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { useCreateAccount } from "@utils/hooks";
import { toast } from "react-toastify";

interface CreateAccountBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const CreateAccountBtn = (props: CreateAccountBtnProps) => {
  const { onClose, handleSubmit } = props;

  const [createAccount, { loading }] = useCreateAccount();

  /** 新增帳號 mutation */
  const onCreateAccount = async (formData: FormData) => {
    await createAccount({
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          companyId: formData.companyId?.value || undefined,
          role: formData.role.value,
        },
      },
      onCompleted: (data) => {
        if (data.createAccount.__typename === "AccountAlreadyExistsError") {
          toast.error("此帳號已被註冊過");
          return;
        }

        if (
          data.createAccount.__typename === "Admin" ||
          data.createAccount.__typename === "Guest"
        ) {
          toast.success("新增成功");
          onClose();
        }
      },
    });
  };

  return (
    <LoadingButton
      loading={loading}
      startIcon={<AddIcon />}
      onClick={handleSubmit(onCreateAccount)}
    >
      新增
    </LoadingButton>
  );
};

export default CreateAccountBtn;
