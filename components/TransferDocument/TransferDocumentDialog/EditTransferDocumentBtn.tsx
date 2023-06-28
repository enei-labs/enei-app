import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { UseFormHandleSubmit } from "react-hook-form";
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

  /** 新增用戶 mutation */
  const onUpdateTransferDocument = async (formData: FormData) => {
    await updateTransferDocument({
      variables: {
        id: transferDocumentId,
        input: {
          number: formData.number,
          name: formData.name,
          receptionAreas: formData.receptionAreas,
          expectedTime: formData.expectedTime,
          printingDoc: formData.printingDoc.id,
          replyDoc: formData.replyDoc.id,
          wordDoc: formData.wordDoc.id,
          formalDoc: formData.formalDoc.id,
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

  return (
    <LoadingButton
      loading={loading}
      startIcon={<AddIcon />}
      onClick={handleSubmit(onUpdateTransferDocument)}
    >
      確認
    </LoadingButton>
  );
};

export default EditTransferDocumentBtn;
