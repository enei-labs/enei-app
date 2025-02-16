import Dialog from "@components/Dialog";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { useForm, useWatch } from "react-hook-form";
import { toast } from "react-toastify";
import TransferDocumentSelector from "./TransferDocumentSelector";
import BasicInfoFields from "./BasicInfoFields";
import DocumentFields from "./DocumentFields";
import TransferDegreeSection from "./TransferDegreeSection";
import { TPCBillHeader } from "./TPCBillHeader";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {
  useLazyTransferDocument,
  useTransferDocuments,
} from "@utils/hooks/queries";
import { useCreateTPCBill } from "@utils/hooks";
import { FormData } from "@components/TPCBill/TPCBillDialog/FormData";

interface TPCBillDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  variant: "create" | "edit";
}

export default function TPCBillDialog(props: TPCBillDialogProps) {
  const { isOpenDialog, onClose, variant } = props;
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useForm<FormData>();

  const { data: transferDocumentsData } = useTransferDocuments();
  const [createTPCBill, { loading: createLoading }] = useCreateTPCBill();
  const [getTransferDocument, { data: transferDocumentData }] =
    useLazyTransferDocument();

  /** component-state */
  const [selectedPowerPlant, selectPowerPlant] = useState<string | null>(null);
  const transferDocumentValue = useWatch({ control, name: "transferDocument" });

  const onCreateTPCBill = async (formData: FormData) => {
    console.log({ formData });
    const transferDegrees = Object.entries(formData.transferDegrees)
      .map(([key, value]) => {
        const [userId, userContractId, powerPlantId, electricNumber] =
          key.split("_");
        return {
          userId,
          userContractId,
          powerPlantId,
          electricNumber,
          degree: Number(value.degree ?? 0),
          fee: Number(value.fee ?? 0),
        };
      })
      .filter((t) => Boolean(t.powerPlantId) && t.powerPlantId !== "null");

    await createTPCBill({
      variables: {
        input: {
          billDoc: formData.billDoc.id,
          billNumber: formData.billNumber,
          billReceivedDate: formData.billReceivedDate,
          billingDate: formData.billingDate,
          transferDocumentId: formData.transferDocument.value,
          transferDegrees,
        },
      },
      onCompleted: () => {
        toast.success("新增成功");
        onClose();
      },
    });
  };

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <TPCBillHeader variant={variant} onClose={onClose} />
        <TransferDocumentSelector
          control={control}
          getTransferDocument={getTransferDocument}
          transferDocumentsData={transferDocumentsData}
          reset={() => {
            reset();
            selectPowerPlant(null);
          }}
        />
        <BasicInfoFields control={control} errors={errors} />
        <DocumentFields control={control} errors={errors} />
        <TransferDegreeSection
          control={control}
          transferDocumentData={transferDocumentData}
          selectedPowerPlant={selectedPowerPlant}
          selectPowerPlant={selectPowerPlant}
          transferDocumentValue={transferDocumentValue}
        />
        <LoadingButton
          loading={createLoading}
          startIcon={<AddIcon />}
          onClick={handleSubmit(onCreateTPCBill)}
        >
          儲存
        </LoadingButton>
      </>
    </Dialog>
  );
}
