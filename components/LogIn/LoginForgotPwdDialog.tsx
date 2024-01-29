import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import Box from "@mui/material/Box";
import Button from "@mui/material/Button";
import Stack from "@mui/material/Stack";
import Typography from "@mui/material/Typography";
import { useValidatedForm } from "@utils/hooks";
import { useState } from "react";
import HelpOutlineIcon from "@mui/icons-material/HelpOutline";

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
        If the entered user account is valid, you will receive an email with
        reset link. Please contact Admin at <b>admin@aegiscustody.com</b> if you
        need further assistance.
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
      <Stack gap="10px">
        <Typography variant="h1">忘記密碼?</Typography>
        <Typography variant="subtitle1">請輸入信箱</Typography>
      </Stack>

      <FieldsController configs={configs} form={{ control, errors }} />

      <Button variant="contained" onClick={handleSubmit(onSubmit)}>
        確定
      </Button>
    </Dialog>
  );
}

export default LoginForgotPwdDialog;
