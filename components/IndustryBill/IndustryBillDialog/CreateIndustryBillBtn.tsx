import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useCreateIndustryBill } from "@utils/hooks";

interface CreateIndustryBillBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const CreateIndustryBillBtn = (props: CreateIndustryBillBtnProps) => {
  const { onClose, handleSubmit } = props;

  const [createIndustryBill, { loading }] = useCreateIndustryBill();

  /** 新增用戶電費單 mutation */
  const onCreateIndustryBill = async (formData: FormData) => {
    console.log(formData);
    await createIndustryBill({
      variables: {
        input: {
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
            bankCode: '',
            account: '',
          },
          electricNumbers: formData.electricNumberInfos.map(
            (i) => i.number.value
          ),
          transportationFee: formData.transportationFee,
          credentialInspectionFee: formData.credentialInspectionFee,
          credentialServiceFee: formData.credentialServiceFee,
          noticeForTheBuilding:
            (formData.noticeForTheBuilding as unknown) === "true",
          noticeForTPCBill: (formData.noticeForTPCBill as unknown) === "true",
          contactName: formData.contactName,
          contactPhone: formData.contactPhone,
          contactEmail: formData.contactEmail,
          address: formData.address,
        },
      },
      onCompleted: (data) => {
        if (data.createIndustryBill.__typename === "IndustryBill") {
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
      onClick={handleSubmit(onCreateIndustryBill)}
    >
      儲存
    </LoadingButton>
  );
};

export default CreateIndustryBillBtn;
