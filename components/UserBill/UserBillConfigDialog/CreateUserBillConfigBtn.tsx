import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useCreateUserBillConfig } from "@utils/hooks/mutations/useCreateUserBillConfig";

interface CreateUserBillConfigBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const CreateUserBillConfigBtn = (props: CreateUserBillConfigBtnProps) => {
  const { onClose, handleSubmit } = props;

  const [createUserBillConfig, { loading }] = useCreateUserBillConfig();

  /** 新增用戶電費單 mutation */
  const onCreateUserBillConfig = async (formData: FormData) => {
    await createUserBillConfig({
      variables: {
        input: {
          name: formData.name,
          userId: formData.userId.value,
          /** 預計電費單寄出期限（收到繳費通知單後天數 */
          estimatedBillDeliverDate: Number(formData.estimatedBillDeliverDate),
          /** 用戶繳費期限（收到繳費通知單後天數） */
          paymentDeadline: Number(formData.paymentDeadline),
          /** 收款帳戶 */
          recipientAccount: {
            bankCode: formData.recipientAccount.value.bankCode,
            account: formData.recipientAccount.value.account,
          },
          electricNumbers: formData.electricNumberInfos.map(
            (i) => i.number.value
          ),
          transportationFee: formData.transportationFee,
          credentialInspectionFee: formData.credentialInspectionFee,
          credentialServiceFee: formData.credentialServiceFee,
          noticeForTPCBill: (formData.noticeForTPCBill as unknown) === "true",
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          address: formData.address,
        },
      },
      onCompleted: (data) => {
        if (data.createUserBillConfig.__typename === "UserBillConfig") {
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
      onClick={handleSubmit(onCreateUserBillConfig)}
    >
      儲存
    </LoadingButton>
  );
};

export default CreateUserBillConfigBtn;
