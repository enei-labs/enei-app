import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useCreateUser } from "@utils/hooks/mutations/useCreateUser";

interface CreateUserBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const CreateUserBtn = (props: CreateUserBtnProps) => {
  const { onClose, handleSubmit } = props;

  const [createUser, { loading }] = useCreateUser();

  /** 新增用戶 mutation */
  const onCreateUser = async (formData: FormData) => {
    await createUser({
      variables: {
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
      onCompleted: (data) => {
        if (data.createUser.__typename === "User") {
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
      onClick={handleSubmit(onCreateUser)}
    >
      新增
    </LoadingButton>
  );
};

export default CreateUserBtn;
