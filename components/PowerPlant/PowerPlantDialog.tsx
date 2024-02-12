import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import {
  useCreateOrUpdate,
  useUpdatePowerPlant,
  useValidatedForm,
} from "@utils/hooks";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreatePowerPlant } from "@utils/hooks/mutations/useCreatePowerPlant";
import { toast } from "react-toastify";
import { CompanyContract, PowerPlant } from "@core/graphql/types";
import { updateFormValues } from "@components/PowerPlant/useUpdateFormValues";

type FormData = {
  name: string;
  number: string;
  price: string;
  volume: number;
  estimatedAnnualPowerGeneration: number;
  transferRate: number;
  address: string;
};

interface PowerPlantDialogProps {
  open: boolean;
  variant: "edit" | "create";
  companyContract?: CompanyContract;
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

  const [createPowerPlant, updatePowerPlant, loading] = useCreateOrUpdate(
    variant,
    useCreatePowerPlant,
    useUpdatePowerPlant
  );

  const { defaultValues, configs } = updateFormValues({
    initialDefaultValues: initialDefaultValues || {},
    companyContract,
  });

  const {
    control,
    handleSubmit,
    formState: { errors },
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
            volume: Number(formData.volume),
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

    if (variant === "edit" && defaultValues) {
      await updatePowerPlant({
        variables: {
          input: {
            id: defaultValues.id,
            name: formData.name,
            number: formData.number,
            volume: Number(formData.volume),
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
        loading={loading}
        onClick={handleSubmit(onSubmit)}
      >
        儲存
      </LoadingButton>
    </Dialog>
  );
};

export default PowerPlantDialog;
