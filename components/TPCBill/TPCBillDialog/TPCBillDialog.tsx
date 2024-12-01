import Dialog from "@components/Dialog";
import { Box, Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FieldsController } from "@components/Controller";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useState } from "react";
import Chip from "@components/Chip";
import {
  useLazyTransferDocument,
  useTransferDocuments,
} from "@utils/hooks/queries";
import { Controller, useForm } from "react-hook-form";
import { InputAutocomplete, InputText } from "@components/Input";
import { LoadingButton } from "@mui/lab";
import { useCreateTPCBill } from "@utils/hooks";
import { FormData } from "@components/TPCBill/TPCBillDialog/FormData";
import { toast } from "react-toastify";

interface TPCBillDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  variant: "create" | "edit";
}

const basicInfoConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "billNumber",
    label: "台電繳費單編號",
    placeholder: "請填入",
    validated: textValidated,
    required: true,
  },
  {
    type: "DATE",
    name: "billReceivedDate",
    label: "收到台電繳費單日期",
    placeholder: "請填入",
    validated: textValidated,
    required: true,
  },
  {
    type: "DATE_MONTH",
    name: "billingDate",
    label: "計費年月",
    placeholder: "請填入",
    validated: textValidated,
    required: true,
  },
];

const docConfigs: FieldConfig[] = [
  {
    type: "FILE",
    name: "billDoc",
    label: "台電繳費單",
    required: true,
  },
];

export default function TPCBillDialog(props: TPCBillDialogProps) {
  const { isOpenDialog, onClose, variant } = props;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>();

  const { data: transferDocumentsData, loading } = useTransferDocuments();
  const [createTPCBill, { loading: createLoading }] = useCreateTPCBill();

  const [getTransferDocument, { data: transferDocumentData }] =
    useLazyTransferDocument();

  /** component-state */
  const [selectedPowerPlant, selectPowerPlant] = useState<string | null>(null);

  const onCreateTPCBill = async (formData: FormData) => {
    const transferDegrees = Object.entries(formData.transferDegrees).map(
      ([key, value]) => {
        const [userId, userContractId, powerPlantId] = key.split("_");
        return {
          userId,
          userContractId,
          powerPlantId,
          degree: Number(value),
        };
      }
    );

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
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增台電代輸繳費單" : "修改台電代輸繳費單"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 代輸繳費單資料 Block */}
        <Typography variant="h5" textAlign={"left"}>
          代輸繳費單資料
        </Typography>
        <Controller
          control={control}
          name={`transferDocument`}
          render={({ field }) => {
            return (
              <>
                <InputAutocomplete
                  {...field}
                  onChange={(e, newValue) => {
                    field.onChange(e);
                    if (e.value) {
                      getTransferDocument({
                        variables: { id: e.value },
                      });
                    }
                  }}
                  options={
                    transferDocumentsData?.transferDocuments.list.map((o) => ({
                      label: o.name,
                      value: o.id,
                    })) ?? []
                  }
                  label={`轉供契約編號`}
                  placeholder={"請填入"}
                  required
                />
              </>
            );
          }}
        />
        <FieldsController
          configs={basicInfoConfigs}
          form={{ control, errors }}
        />

        {/* 相關文件 Block */}
        <Typography textAlign="left" variant="h5">
          相關文件
        </Typography>
        <FieldsController configs={docConfigs} form={{ control, errors }} />

        {/* 轉供度數 Block */}
        <Typography textAlign="left" variant="h5">
          轉供度數
        </Typography>
        <Box display={"flex"} flexDirection="column" rowGap="24px">
          <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
            {(
              transferDocumentData?.transferDocument
                .transferDocumentPowerPlants ?? []
            ).map((item) => {
              return (
                <Chip
                  key={item.powerPlant.id}
                  label={`${item.powerPlant.name}(${item.powerPlant.number})`}
                  handleClick={() => selectPowerPlant(item.powerPlant.id)}
                />
              );
            })}
          </Box>
          {transferDocumentData && selectedPowerPlant
            ? transferDocumentData.transferDocument.transferDocumentUsers.map(
                (item, index) => {
                  if (!item.userContract) return null;
                  return (
                    <Controller
                      key={`transferDegrees.${item.user.id}_${item.userContract.id}_${selectedPowerPlant}_${index}`}
                      control={control}
                      name={`transferDegrees.${item.user.id}_${item.userContract.id}_${selectedPowerPlant}_${index}`}
                      render={({ field }) => (
                        <InputText
                          {...field}
                          type="number"
                          label={`${item.user.name}(kWh)`}
                        />
                      )}
                      rules={{ min: 0 }}
                    />
                  );
                }
              )
            : null}
        </Box>
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
