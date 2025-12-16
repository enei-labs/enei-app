import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { FieldErrors, UseFormHandleSubmit } from "react-hook-form";
import { FormData } from "./FormData";
import { toast } from "react-toastify";
import { useCreateTransferDocument } from "@utils/hooks/mutations";

interface CreateTransferDocumentBtnProps {
  onClose: VoidFunction;
  handleSubmit: UseFormHandleSubmit<FormData>;
}

const CreateTransferDocumentBtn = (props: CreateTransferDocumentBtnProps) => {
  const { onClose, handleSubmit } = props;

  const [createTransferDocument, { loading }] = useCreateTransferDocument();

  /** 新增用戶 mutation */
  const onCreateTransferDocument = async (formData: FormData) => {
    await createTransferDocument({
      variables: {
        input: {
          number: formData.number,
          name: formData.name,
          receptionAreas: formData.receptionAreas,
          expectedTime: formData.expectedTime,
          printingDoc: formData.printingDoc?.id ?? null,
          replyDoc: formData.replyDoc?.id ?? null,
          wordDoc: formData.wordDoc?.id ?? null,
          formalDoc: formData.formalDoc?.id ?? null,
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
        if (data.createTransferDocument.__typename === "TransferDocument") {
          toast.success("新增成功");
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
      onClick={handleSubmit(onCreateTransferDocument, onInvalid)}
    >
      儲存
    </LoadingButton>
  );
};

export default CreateTransferDocumentBtn;
