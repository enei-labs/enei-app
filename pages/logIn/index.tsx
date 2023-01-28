import { FieldsController } from "@components/Controller";
import FormBox from "@components/FormBox";
import { Layout } from "@components/Layout";
import { LogInForgotPwdBtn, LogInSetNewPwdDialog } from "@components/LogIn";
import { useAuth } from "@core/context/auth";
import { FieldConfig } from "@core/types";
import { passwordValidated, textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box, Stack, Typography } from "@mui/material";
import { useSignInAdmin, useValidatedForm } from "@utils/hooks";
import Head from "next/head";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";

type FormData = {
  email: string;
  password: string;
};

const configs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "email",
    label: "信箱",
    required: true,
    validated: textValidated.email(),
  },
  {
    type: "PASSWORD",
    name: "password",
    label: "密碼",
    required: true,
    validated: passwordValidated,
  },
];

const LogIn = () => {
  const { logIn } = useAuth();

  const [open, setOpen] = useState(false);

  const [signInAdmin, { loading }] = useSignInAdmin();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    const { data } = await signInAdmin({
      variables: {
        email: formData.email,
        password: formData.password,
      },
    });

    if (data?.signInAdmin.__typename !== "Admin") {
      toast.error("帳號或密碼不正確");
      return;
    }

    if (data.signInAdmin.hasSetPassword === false) {
      setOpen(true);
      return;
    }

    await logIn();
  };

  return (
    <>
      <Head>
        <title>登入</title>
        <meta name="description" content="登入" />
      </Head>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <FormBox>
          <Stack gap="10px">
            <Typography variant="h1">Log In</Typography>
            <Typography variant="subtitle1" color="text.primary">
              Enter details to log in.
            </Typography>
          </Stack>

          <FieldsController configs={configs} form={{ control, errors }} />

          <LogInForgotPwdBtn />

          <LoadingButton type="submit" variant="contained" loading={loading}>
            登入
          </LoadingButton>
        </FormBox>
      </Box>

      <LogInSetNewPwdDialog open={open} onClose={() => setOpen(false)} />
    </>
  );
};

LogIn.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default LogIn;
