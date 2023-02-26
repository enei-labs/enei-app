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

const styles = {
  box: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
  },
  btn: [
    (theme: any) => ({
      display: "flex",
      justifyContent: "center",
      alignItems: "center",
      columnGap: "8px",
      color: theme.palette.primary.main,
      border: "none",
    }),
  ],
};

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
    <Box sx={styles.box}>
      <Button
        disableRipple
        variant="outlined"
        onClick={() => setOpen(true)}
        sx={styles.btn}
      >
        <HelpOutlineIcon />
        <span>忘記密碼?</span>
      </Button>

      <Dialog open={open} onClose={() => setOpen(false)}>
        <Stack gap="10px">
          <Typography variant="h1">忘記密碼?</Typography>
          <Typography variant="subtitle1">請輸入信箱</Typography>
        </Stack>

        <FieldsController configs={configs} form={{ control, errors }} />

        <Button variant="contained" onClick={handleSubmit(onSubmit)}>
          確定
        </Button>
      </Dialog>
    </Box>
  );
};

export default LogInForgotPwdBtn;
