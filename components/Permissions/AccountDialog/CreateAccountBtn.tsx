import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { ACCOUNTS } from "@core/graphql/queries";
import { useCreateAccount } from "@utils/hooks";
import { useLoading } from "@utils/hooks/useLoading";

interface CreateAccountBtnProps {
  closeDialog: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const CreateAccountBtn = (props: CreateAccountBtnProps) => {
  const { closeDialog, handleSubmit } = props;

  const { isLoading, loader } = useLoading();
  const [createAccount] = useCreateAccount();

  /** 新增帳號 mutation */
  const onCreateAccount = async (formData: FormData) => {
    const { data } = await createAccount({
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          companyId: formData.companyId?.value || undefined,
          role: formData.role.value,
        },
      },
      refetchQueries: [ACCOUNTS],
    });

    if (data) {
      closeDialog();
    }
  };

  return (
    <LoadingButton
      loading={isLoading}
      startIcon={<AddIcon />}
      onClick={handleSubmit(loader(onCreateAccount))}
    >
      新增
    </LoadingButton>
  );
};

export default CreateAccountBtn;
