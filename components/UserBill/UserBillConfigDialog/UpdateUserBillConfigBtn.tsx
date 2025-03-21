import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useUpdateUserBillConfig } from "@utils/hooks";

interface UpdateUserBillConfigBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
  userBillConfigId: string;
}

const UpdateUserBillConfigBtn = (props: UpdateUserBillConfigBtnProps) => {
  const { userBillConfigId, onClose, handleSubmit } = props;

  const [updateUserBillConfig, { loading }] = useUpdateUserBillConfig();

  /** 更新用戶電費單組合 mutation */
  const onUpdateUserBill = async (formData: FormData) => {
    await updateUserBillConfig({
      variables: {
        input: {
          id: userBillConfigId,
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
        if (data.updateUserBillConfig.__typename === "UserBillConfig") {
          toast.success("更新成功");
          onClose();
        }
      },
    });
  };

  return (
    <LoadingButton
      loading={loading}
      startIcon={<AddIcon />}
      onClick={handleSubmit(onUpdateUserBill)}
    >
      儲存
    </LoadingButton>
  );
};

export default UpdateUserBillConfigBtn;
