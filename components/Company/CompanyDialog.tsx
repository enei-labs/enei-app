import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig, Option } from "@core/types";
import { numberValidated, textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import { useUpdatePowerPlant, useValidatedForm } from "@utils/hooks";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreatePowerPlant } from "@utils/hooks/mutations/useCreatePowerPlant";
import { toast } from "react-toastify";
import { PowerPlant } from "@core/graphql/types";

type FormData = {
  name: string;
  number: string;
  volume: number;
  estimatedAnnualPowerGeneration: number;
  transferRate: number;
  address: string;
};

const configs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    label: "電廠名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "number",
    label: "電號",
    required: true,
    validated: textValidated,
  },
  {
    type: "NUMBER",
    name: "volume",
    label: "裝置容量（kW）",
    required: true,
    validated: numberValidated,
  },
  {
    type: "NUMBER",
    name: "annualPowerGeneration",
    label: "年發電量（MWh",
    required: true,
    validated: numberValidated,
  },
  {
    type: "NUMBER",
    name: "estimatedAnnualPowerGeneration",
    label: "單位預估年發電量（度/kW）",
    required: true,
    validated: numberValidated,
  },
  {
    type: "TEXT",
    name: "transferRate",
    label: "轉供比例（%）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "address",
    label: "地址",
    required: true,
    validated: textValidated,
  },
];

interface PowerPlantDialogProps {
  open: boolean;
  variant: "edit" | "create";
  companyContractId?: string;
  onClose: VoidFunction;
  defaultValues?: Omit<PowerPlant, "annualPowerGeneration">;
}

const PowerPlantDialog = (props: PowerPlantDialogProps) => {
  const { open, companyContractId, onClose, variant, defaultValues } = props;

  const [createPowerPlant, { loading }] = useCreatePowerPlant();
  const [updatePowerPlant, { loading: updateLoading }] = useUpdatePowerPlant();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs, {
    defaultValues,
  });

  const onSubmit = async (formData: FormData) => {
    if (variant === "create" && companyContractId) {
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
            companyContractId,
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
    <Dialog
      key="form"
      open={!!state.form}
      onClose={() => dispatch({ form: false })}
    >
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          公司資訊
        </Typography>
        <IconBtn
          icon={<CloseIcon />}
          onClick={() => dispatch({ form: false })}
        />
      </Grid>
      <FieldsController
        configs={configs.slice(0, 2)}
        form={{ control, errors }}
      />

      <Typography variant="h5">聯絡人資訊</Typography>
      <FieldsController configs={configs.slice(2)} form={{ control, errors }} />

      <LoadingButton
        startIcon={<AddIcon />}
        variant="contained"
        loading={loading}
        onClick={handleSubmit(onSubmit)}
      >
        新增
      </LoadingButton>
    </Dialog>
  );
};

export default PowerPlantDialog;
