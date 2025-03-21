import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useUpdateIndustryBillConfig } from "@utils/hooks";

interface UpdateIndustryBillBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
  industryBillId: string;
}

const UpdateIndustryBillBtn = (props: UpdateIndustryBillBtnProps) => {
  const { industryBillId, onClose, handleSubmit } = props;

  const [updateIndustryBillConfig, { loading }] = useUpdateIndustryBillConfig();

  /** 更新用戶電費單組合 mutation */
  const onUpdateIndustryBill = async (formData: FormData) => {
    await updateIndustryBillConfig({
      variables: {
        input: {
          id: industryBillId,
          name: formData.name,
          industryId: formData.industryId.value,
          /** 預計電費單寄出期限（收到繳費通知單後天數 */
          estimatedBillDeliverDate: Number(formData.estimatedBillDeliverDate),
          /** 用戶繳費期限（收到繳費通知單後天數） */
          paymentDeadline: Number(formData.paymentDeadline),
          /** 收款帳戶 */
          // recipientAccount: {
          //   bankCode: formData.recipientAccount.value.bankCode,
          //   account: formData.recipientAccount.value.account,
          // },
          recipientAccount: {
            bankCode: "",
            account: "",
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
        if (data.updateIndustryBillConfig.__typename === "IndustryBillConfig") {
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
      onClick={handleSubmit(onUpdateIndustryBill)}
    >
      儲存
    </LoadingButton>
  );
};

export default UpdateIndustryBillBtn;
