import Dialog from "@components/Dialog";
import { LoadingButton } from "@mui/lab";
import { useState } from "react";
import { FormProvider, useForm } from "react-hook-form";
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
import { PowerPlant } from "@core/graphql/types";

interface TPCBillDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  variant: "create" | "edit";
}

export default function TPCBillDialog(props: TPCBillDialogProps) {
  const { isOpenDialog, onClose, variant } = props;
  const methods = useForm<FormData>({
    defaultValues: {
      transferDocument: null,
      billNumber: "",
      billReceivedDate: new Date(),
      billingDate: new Date(),
      billDoc: null,
      transferDegrees: {},
    },
  });
  const { handleSubmit, reset } = methods;

  const { data: transferDocumentsData } = useTransferDocuments();
  const [createTPCBill, { loading: createLoading }] = useCreateTPCBill();
  const [getTransferDocument, { data: transferDocumentData }] =
    useLazyTransferDocument();

  /** component-state */
  const [selectedPowerPlant, selectPowerPlant] = useState<PowerPlant | null>(
    null
  );

  const onCreateTPCBill = async (formData: FormData) => {
    if (!formData.transferDocument?.value) {
      toast.error("請選擇轉供契約");
      return;
    }
    
    if (!formData.billDoc?.id) {
      /** @TODO 確認是否為必填 */
      toast.error("請上傳台電繳費單");
      return;
    }
    const transferDegrees = Object.entries(formData.transferDegrees)
      .map(([key, value]) => {
        const [powerPlantNumber, electricNumber] = key.split("_");

        return {
          powerPlantId: value.powerPlantId,
          // powerPlantNumber,
          electricNumber,
          degree: Number(value.degree ?? 0),
          fee: Number(value.fee ?? 0),
          userId: value.userId,
          userContractId: value.userContractId,
        };
      })
      .filter(
        (t) =>
          Boolean(t.powerPlantId) &&
          t.powerPlantId !== "null" &&
          t.powerPlantId !== "undefined" &&
          Boolean(t.userId) &&
          t.userId !== "null" &&
          t.userId !== "undefined"
      );

    await createTPCBill({
      variables: {
        input: {
          billDoc: formData.billDoc?.id,
          billNumber: formData.billNumber,
          billReceivedDate: formData.billReceivedDate,
          billingDate: formData.billingDate,
          transferDocumentId: formData.transferDocument?.value,
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
      <FormProvider {...methods}>
        <TPCBillHeader variant={variant} onClose={onClose} />
        <TransferDocumentSelector
          getTransferDocument={getTransferDocument}
          transferDocumentsData={transferDocumentsData}
          reset={() => {
            reset();
            selectPowerPlant(null);
          }}
        />
        <BasicInfoFields />
        <DocumentFields />
        <TransferDegreeSection
          transferDocumentData={transferDocumentData}
          selectedPowerPlant={selectedPowerPlant}
          selectPowerPlant={selectPowerPlant}
        />
        <LoadingButton
          loading={createLoading}
          startIcon={<AddIcon />}
          onClick={handleSubmit(onCreateTPCBill)}
        >
          儲存
        </LoadingButton>
      </FormProvider>
    </Dialog>
  );
}
