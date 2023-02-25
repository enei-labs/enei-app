import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { passwordValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Stack, Typography } from "@mui/material";
import { useSetPassword, useValidatedForm } from "@utils/hooks";
import React from "react";
import { toast } from "react-toastify";
import * as yup from "yup";

type FormData = {
  newPassword: string;
  confirmPassword: string;
};

interface LogInSetNewPwdDialogProps {
  open: boolean;
  onClose: () => void;
}

const configs: FieldConfig[] = [
  {
    type: "PASSWORD",
    name: "newPassword",
    label: "新密碼",
    required: true,
    validated: passwordValidated,
    hint: <>至少 8 個字符，包括大寫字母、小寫字母和數字。</>,
  },
  {
    type: "PASSWORD",
    name: "confirmPassword",
    label: "確認新密碼",
    required: true,
    validated: yup
      .string()
      .required("This is required")
      .oneOf([yup.ref("newPassword"), null], "密碼不正確"),
  },
];

const LogInSetNewPwdDialog: React.FC<LogInSetNewPwdDialogProps> = ({
  open,
  onClose,
}) => {
  const [setPassword, { loading }] = useSetPassword();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    const { data } = await setPassword({
      variables: {
        newPassword: formData.newPassword,
      },
    });

    if (data?.setPassword.__typename === "Admin") {
      toast.success("Success");
      onClose();
    }
  };

  return (
    <Dialog open={open} onClose={onClose}>
      <Stack gap="10px">
        <Typography variant="h1">設定新密碼</Typography>
        <Typography variant="subtitle1">
          Change of password is required.
        </Typography>
      </Stack>

      <FieldsController configs={configs} form={{ control, errors }} />

      <LoadingButton
        variant="contained"
        loading={loading}
        onClick={handleSubmit(onSubmit)}
      >
        確認
      </LoadingButton>
    </Dialog>
  );
};

export default LogInSetNewPwdDialog;
