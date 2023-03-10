import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig, Option } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Button, Grid, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useState } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreatePowerPlant } from "@utils/hooks/mutations/useCreatePowerPlant";
import { toast } from "react-toastify";

type FormData = {
  name: string;
  number: string;
  capacity: string;
  annualPowerGeneration: string;
  predictAnnualPowerGeneration: string;
  transferRate: string;
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
    type: "TEXT",
    name: "capacity",
    label: "裝置容量（kW）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "annualPowerGeneration",
    label: "年發電量（MWh",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "predictAnnualPowerGeneration",
    label: "單位預估年發電量（度/kW）",
    required: true,
    validated: textValidated,
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

const AddPowerPlantBtn = () => {
  const [open, setOpen] = useState(false);

  const [createPowerPlant, { loading }] = useCreatePowerPlant();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    await createPowerPlant({
      variables: {
        input: {
          name: formData.name,
          number: formData.number,
          capacity: formData.capacity,
          annualPowerGeneration: formData.annualPowerGeneration,
          predictAnnualPowerGeneration: formData.predictAnnualPowerGeneration,
          transferRate: formData.transferRate,
          address: formData.address,
        },
      },
      onCompleted: (data) => {
        toast.success("新增成功");
        setOpen(false);
      },
    });
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => setOpen(true)}>
        新增電廠
      </Button>

      <Dialog key="form" open={open} onClose={() => setOpen(false)}>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            電廠資訊
          </Typography>
          <IconBtn icon={<CloseIcon />} onClick={() => setOpen(false)} />
        </Grid>
        <FieldsController configs={configs} form={{ control, errors }} />
        <LoadingButton
          startIcon={<AddIcon />}
          variant="contained"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          新增
        </LoadingButton>
      </Dialog>
    </>
  );
};

export default AddPowerPlantBtn;
