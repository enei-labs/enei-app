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

type FormData = {
  email: string;
};

const configs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "email",
    label: "信箱",
    required: true,
    validated: textValidated.email(),
    hint: (
      <>
        If the entered user account is valid, you will receive an email with
        reset link. Please contact Admin at <b>admin@aegiscustody.com</b> if you
        need further assistance.
      </>
    ),
  },
];

const LogInForgotPwdBtn = () => {
  const [open, setOpen] = useState(false);

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    console.log(formData);
  };

  return (
    <Box textAlign="right">
      <Button disableRipple onClick={() => setOpen(true)}>
        忘記密碼?
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Stack gap="10px">
          <Typography variant="h1">忘記密碼?</Typography>
          <Typography variant="subtitle1">
            Enter user account to receive temporary password.
          </Typography>
        </Stack>

        <FieldsController configs={configs} form={{ control, errors }} />

        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          Confirm
        </Button>
      </Dialog>
    </Box>
  );
};

export default LogInForgotPwdBtn;
