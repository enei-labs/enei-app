import { FieldsController } from "@components/Controller";
import FormBox from "@components/FormBox";
import { Layout } from "@components/Layout";
import { LogInForgotPwdBtn } from "@components/LogIn";
import { useAuth } from "@core/context/auth";
import { FieldConfig } from "@core/types";
import { passwordValidated, textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box } from "@mui/material";
import { useSignIn, useValidatedForm } from "@utils/hooks";
import Head from "next/head";
import { ReactElement, useState } from "react";
import { toast } from "react-toastify";
import Logo from "public/logo-with-name.svg";
import LoginIcon from "@mui/icons-material/Login";
import dynamic from "next/dynamic";
import { useRouter } from "next/router";

const LogInSetNewPwdDialog = dynamic(
  () => import("@components/LogIn/LogInSetNewPwdDialog")
);

type FormData = {
  email: string;
  password: string;
};

const configs: FieldConfig[] = [
  {
    type: "EMAIL",
    name: "email",
    label: "信箱",
    required: true,
    validated: textValidated.email("請輸入有效的電子郵件地址"),
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
  const router = useRouter();

  const [open, setOpen] = useState(false);

  const [signIn, { loading }] = useSignIn();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    await signIn({
      variables: {
        email: formData.email,
        password: formData.password,
      },
      onCompleted: async (data) => {
        if (data.signIn.__typename === "InvalidSignInInputError") {
          toast.error("帳號或密碼不正確");
          return;
        }

        if (
          (data.signIn.__typename === "Admin" ||
            data.signIn.__typename === "Guest") &&
          data.signIn.hasSetPassword === false
        ) {
          setOpen(true);
          return;
        } else {
          logIn().then(() => {
            router.push("/main");
            toast.success("登入成功");
          });
        }
      },
    });
  };

  return (
    <>
      <Head>
        <title>登入</title>
        <meta name="description" content="登入" />
      </Head>

      <Box component="form" onSubmit={handleSubmit(onSubmit)}>
        <Logo height="40" />
        <FormBox>
          <FieldsController configs={configs} form={{ control, errors }} />

          <LoadingButton
            startIcon={<LoginIcon />}
            sx={{ width: "80px", marginTop: "24px" }}
            type="submit"
            variant="contained"
            loading={loading}
          >
            登入
          </LoadingButton>
          <LogInForgotPwdBtn />
        </FormBox>
      </Box>

      {open ? (
        <LogInSetNewPwdDialog open={open} onClose={() => setOpen(false)} />
      ) : null}
    </>
  );
};

LogIn.getLayout = (page: ReactElement) => {
  return <Layout>{page}</Layout>;
};

export default LogIn;
