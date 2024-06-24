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
import { CompanyContract, PowerPlant } from "@core/graphql/types";
import { updateFormValues } from "@components/PowerPlant/useUpdateFormValues";
import { useEffect } from "react";

type FormData = {
  name: string;
  number: string;
  price: string;
  volume: number;
  estimatedAnnualPowerGeneration: number;
  transferRate: number;
  address: string;
  supplyVolume: number;
};

interface PowerPlantDialogProps {
  open: boolean;
  variant: "edit" | "create";
  companyContract?: CompanyContract;
  companyContractId: string;
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
    companyContractId,
  } = props;

  const [createPowerPlant, { loading }] =
    useCreatePowerPlant(companyContractId);
  const [updatePowerPlant, { loading: updateLoading }] =
    useUpdatePowerPlant(companyContractId);

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
    defaultValues,
  });

  const onSubmit = async (formData: FormData) => {
    if (variant === "create" && companyContract) {
      await createPowerPlant({
        variables: {
          input: {
            name: formData.name,
            number: formData.number,
            volume: Number(formData.volume * 1000),
            estimatedAnnualPowerGeneration: Number(
              formData.estimatedAnnualPowerGeneration
            ),
            transferRate: Number(formData.transferRate),
            address: formData.address,
            companyContractId: companyContract.id,
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
            volume: Number(formData.volume * 1000),
            estimatedAnnualPowerGeneration: Number(
              formData.estimatedAnnualPowerGeneration
            ),
            transferRate: Number(formData.transferRate),
            address: formData.address,
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
