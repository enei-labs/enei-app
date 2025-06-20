import { IconBtn } from "@components/Button";
import Dialog from "@components/Dialog";
import { Grid, Typography } from "@mui/material";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { numberValidated, textValidated } from "@core/types/fieldConfig";
import { useUpdateFee, useValidatedForm } from "@utils/hooks";
import { LoadingButton } from "@mui/lab";
import { toast } from "react-toastify";

type Fee = {
  substitutionFee: string | number | null | undefined;
  certificateVerificationFee: string | number | null | undefined;
  certificateServiceFee: string | number | null | undefined;
};

type FeeDialogProps = {
  isOpenDialog: boolean;
  onClose: VoidFunction;
  fee?: Fee;
};

type FormData = {
  certificateServiceFee: string;
  certificateVerificationFee: string;
  substitutionFee: string;
};

const fieldConfigs: FieldConfig[] = [
  {
    type: "NUMBER",
    name: "substitutionFee",
    label: "代輸費（元/kWh）",
    validated: numberValidated,
  },
  {
    type: "NUMBER",
    name: "certificateVerificationFee",
    label: "憑證審查費（元/kWh）",
    validated: numberValidated,
  },
  {
    type: "NUMBER",
    name: "certificateServiceFee",
    label: "憑證服務費（元/kWh）",
    validated: numberValidated,
  },
];

function FeeDialog(props: FeeDialogProps) {
  const { isOpenDialog, onClose, fee } = props;

  const [updateFee, { loading }] = useUpdateFee();

  const defaultValues: FormData = {
    substitutionFee: fee?.substitutionFee?.toString() || "",
    certificateVerificationFee: fee?.certificateVerificationFee?.toString() || "",
    certificateServiceFee: fee?.certificateServiceFee?.toString() || "",
  };

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(fieldConfigs, {
    defaultValues,
  });

  const onSubmit = async (formData: FormData) => {
    await updateFee({
      variables: {
        input: {
          certificateServiceFee: formData.certificateServiceFee.toString(),
          certificateVerificationFee:
            formData.certificateVerificationFee.toString(),
          substitutionFee: formData.substitutionFee.toString(),
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
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          修改規費
        </Typography>
        <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
      </Grid>

      {/* 轉供資料 Block */}
      <Typography variant="h5" textAlign={"left"}>
        轉供資料
      </Typography>
      <FieldsController configs={fieldConfigs} form={{ control, errors }} />

      <LoadingButton
        loading={loading}
        variant="contained"
        onClick={handleSubmit(onSubmit)}
      >
        儲存
      </LoadingButton>
    </Dialog>
  );
}

export default FeeDialog;
