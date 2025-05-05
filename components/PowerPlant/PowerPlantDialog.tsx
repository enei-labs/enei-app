import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { useUpdatePowerPlant, useValidatedForm } from "@utils/hooks";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreatePowerPlant } from "@utils/hooks/mutations/useCreatePowerPlant";
import { toast } from "react-toastify";
import {
  CompanyContract,
  EnergyType,
  GenerationType,
  PowerPlant,
} from "@core/graphql/types";
import { updateFormValues } from "@components/PowerPlant/useUpdateFormValues";
import { useEffect } from "react";

type FormData = {
  name: string;
  number: string;
  price: string;
  volume: number;
  estimatedAnnualPowerGeneration: number;
  transferRate: number;
  energyType: EnergyType;
  generationType: GenerationType;
  address: string;
  supplyVolume: number;
  recipientAccount?: {
    label: string;
    value: string;
  };
};

interface PowerPlantDialogProps {
  open: boolean;
  variant: "edit" | "create";
  companyContract: CompanyContract;
  onClose: VoidFunction;
  defaultValues?: Partial<Omit<PowerPlant, "annualPowerGeneration">>;
}

const PowerPlantDialog = (props: PowerPlantDialogProps) => {
  const {
    open,
    companyContract,
    onClose,
    variant,
    defaultValues: initialDefaultValues,
  } = props;

  const [createPowerPlant, { loading }] = useCreatePowerPlant(
    companyContract.id
  );
  const [updatePowerPlant, { loading: updateLoading }] = useUpdatePowerPlant(
    companyContract.id
  );

  const { defaultValues, configs } = updateFormValues({
    initialDefaultValues: initialDefaultValues || {},
    companyContract,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
    setValue,
    watch,
  } = useValidatedForm<FormData>(configs, {
    defaultValues: {
      ...defaultValues,
      recipientAccount: defaultValues.recipientAccount
        ? {
            label: `(${defaultValues.recipientAccount.bankCode}) ${defaultValues.recipientAccount.account}`,
            value: `${defaultValues.recipientAccount.bankCode}|${defaultValues.recipientAccount.account}`,
          }
        : undefined,
    },
  });

  const onSubmit = async (formData: FormData) => {
    if (variant === "create" && companyContract) {
      await createPowerPlant({
        variables: {
          input: {
            name: formData.name,
            number: formData.number,
            volume: parseInt((Number(formData.volume) * 1000).toFixed(0)),
            energyType: formData.energyType,
            generationType: formData.generationType,
            estimatedAnnualPowerGeneration: Number(
              formData.estimatedAnnualPowerGeneration
            ),
            transferRate: Number(formData.transferRate),
            address: formData.address,
            price: formData.price,
            companyContractId: companyContract.id,
            recipientAccount: formData.recipientAccount
              ? {
                  bankCode: formData.recipientAccount.value.split("|")[0],
                  account: formData.recipientAccount.value.split("|")[1],
                }
              : undefined,
          },
        },
        onCompleted: () => {
          toast.success("新增成功");
          onClose();
        },
      });
    }

    if (variant === "edit" && defaultValues && defaultValues.id) {
      await updatePowerPlant({
        variables: {
          input: {
            id: defaultValues.id,
            name: formData.name,
            number: formData.number,
            generationType: formData.generationType,
            energyType: formData.energyType,
            volume: parseInt((Number(formData.volume) * 1000).toFixed(0)),
            estimatedAnnualPowerGeneration: Number(
              formData.estimatedAnnualPowerGeneration
            ),
            price: formData.price,
            transferRate: Number(formData.transferRate),
            address: formData.address,
            recipientAccount: formData.recipientAccount
              ? {
                  bankCode: formData.recipientAccount.value.split("|")[0],
                  account: formData.recipientAccount.value.split("|")[1],
                }
              : undefined,
          },
        },
        onCompleted: () => {
          toast.success("更新成功");
          onClose();
        },
      });
    }
  };

  const volume = watch("volume");
  const transferRate = watch("transferRate");

  useEffect(() => {
    if (volume && transferRate) {
      setValue("supplyVolume", volume * (transferRate / 100));
    }
  }, [setValue, volume, transferRate]);

  return (
    <Dialog key="form" open={open} onClose={onClose}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          電廠資訊
        </Typography>
        <IconBtn icon={<CloseIcon />} onClick={onClose} />
      </Grid>
      <FieldsController configs={configs} form={{ control, errors }} />
      <LoadingButton
        startIcon={<AddIcon />}
        variant="contained"
        loading={variant === "create" ? loading : updateLoading}
        onClick={handleSubmit(onSubmit)}
      >
        儲存
      </LoadingButton>
    </Dialog>
  );
};

export default PowerPlantDialog;
