import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import Button from "@mui/material/Button";
import Grid from "@mui/material/Grid";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useValidatedForm } from "@utils/hooks";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";

type FormData = {
  email: string;
};

const configs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "email",
    label: "信箱",
    required: true,
    validated: textValidated.email("請輸入有效的電子郵件地址"),
    hint: (
      <>
        如果輸入的用戶帳戶有效，您將收到一封包含重設連結的電子郵件。
        如需進一步協助，請聯繫管理員 <b>admin@aegiscustody.com</b>。
      </>
    ),
  },
];

interface LoginForgotPwdDialogProps {
  open: boolean;
  onClose: VoidFunction;
}

function LoginForgotPwdDialog(props: LoginForgotPwdDialogProps) {
  const { open, onClose } = props;
  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    console.log(formData);
  };
  return (
    <Dialog open={open} onClose={onClose}>
      <Grid container alignItems={"center"}>
        <Grid item xs={2}></Grid>
        <Grid item xs={8} textAlign="center">
          <Typography variant="h4">忘記密碼?</Typography>
        </Grid>
        <Grid item xs={2} textAlign="right">
          <IconBtn icon={<CloseIcon />} onClick={onClose} />
        </Grid>
      </Grid>
      <FieldsController configs={configs} form={{ control, errors }} />

      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        確定
      </Button>
    </Dialog>
  );
}

export default LoginForgotPwdDialog;
