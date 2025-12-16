import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useUpdateTransferDocument } from "@utils/hooks/mutations";

interface EditTransferDocumentBtnProps {
  transferDocumentId: string;
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const EditTransferDocumentBtn = (props: EditTransferDocumentBtnProps) => {
  const { transferDocumentId, onClose, handleSubmit } = props;

  const [updateTransferDocument, { loading }] = useUpdateTransferDocument();

  const onUpdateTransferDocument = async (formData: FormData) => {
    await updateTransferDocument({
      variables: {
        id: transferDocumentId,
        input: {
          number: formData.number,
          name: formData.name,
          receptionAreas: formData.receptionAreas,
          expectedTime: formData.expectedTime,
          printingDoc: formData.printingDoc?.id ?? undefined,
          replyDoc: formData.replyDoc?.id ?? undefined,
          wordDoc: formData.wordDoc?.id ?? undefined,
          formalDoc: formData.formalDoc?.id ?? undefined,
          powerPlants: formData.transferDocumentPowerPlants.map((t) => ({
            estimateAnnualSupply: Number(t.estimateAnnualSupply),
            powerPlantId: t.powerPlant.value,
            transferRate: Number(t.transferRate),
          })),
          users: formData.transferDocumentUsers.map((u) => ({
            monthlyTransferDegree: Number(u.monthlyTransferDegree),
            expectedYearlyPurchaseDegree: Number(
              u.expectedYearlyPurchaseDegree
            ),
            userId: u.user.value,
            userContractId: u.userContract.value,
            electricNumber: u.electricNumber.value,
            yearlyTransferDegree: Number(u.yearlyTransferDegree),
          })),
        },
      },
      onCompleted: (data) => {
        if (data.updateTransferDocument.__typename === "TransferDocument") {
          toast.success("修改成功");
          onClose();
        }
      },
    });
  };

  // 表單驗證失敗時顯示錯誤提示
  const onInvalid = (errors: FieldErrors<FormData>) => {
    console.error('表單驗證失敗:', errors);
    toast.error('請確認所有必填欄位都已填寫');
  };

  return (
    <LoadingButton
      loading={loading}
      startIcon={<AddIcon />}
      onClick={handleSubmit(onUpdateTransferDocument, onInvalid)}
    >
      確認
    </LoadingButton>
  );
};

export default EditTransferDocumentBtn;
