import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { AuthLayout } from "@components/Layout";
import { Box, Card, Toolbar, Typography } from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import { FieldsController } from "@components/Controller";
import {
  useRequestResetPassword,
  useResetPassword,
  useValidatedForm,
} from "@utils/hooks";
import { useAuth } from "@core/context/auth";
import { LoadingButton } from "@mui/lab";
import LoginIcon from "@mui/icons-material/Login";
import { toast } from "react-toastify";
import { useRouter } from "next/router";

type FormData = {
  oldPassword: string;
  newPassword: string;
  confirmPassword: string;
};

const fieldConfigs: FieldConfig[] = [
  {
    type: "PASSWORD",
    name: "oldPassword",
    label: "舊密碼",
    validated: textValidated,
  },
  {
    type: "PASSWORD",
    name: "newPassword",
    label: "新密碼",
    validated: textValidated,
  },
  {
    type: "PASSWORD",
    name: "confirmPassword",
    label: "確認新密碼",
    validated: textValidated,
  },
];

const ResetPassword = () => {
  const router = useRouter();
  const _token = router.query.token as string;
  const [token, setToken] = useState<string>(_token);
  console.log({ token });
  const [requestResetPassword, { loading }] = useRequestResetPassword();
  const [resetPassword, { loading: resetLoading }] = useResetPassword();

  const configs = token ? fieldConfigs.slice(1) : fieldConfigs.slice(0, 1);

  const { me } = useAuth();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    if (token) {
      if (formData.confirmPassword !== formData.newPassword) {
        toast.error("密碼不一致");
        return;
      } else {
        await resetPassword({
          variables: {
            token: token,
            newPassword: formData.newPassword,
          },
          onCompleted: () => {
            toast.success("密碼更換成功");
            router.push("/main");
          },
        });
      }
    } else {
      await requestResetPassword({
        variables: {
          id: me?.id ?? "",
          oldPassword: formData.oldPassword,
        },
        onCompleted: (data) => {
          if (data.requestResetPassword.__typename === "PasswordReset") {
            setToken(data.requestResetPassword.id);
          }
        },
      });
    }
  };

  return (
    <>
      <Head>
        <title>修改密碼</title>
        <meta name="description" content="修改密碼" />
      </Head>
      <Toolbar></Toolbar>
      <IconBreadcrumbs
        items={[
          {
            name: "修改密碼",
            icon: AccountCircleOutlinedIcon,
            href: "/reset-password",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <Card sx={{ p: "36px" }}>
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              rowGap: "12px",
            }}
          >
            <Typography variant="h4">修改密碼</Typography>
            <FieldsController configs={configs} form={{ control, errors }} />

            <LoadingButton
              startIcon={<LoginIcon />}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              loading={token ? resetLoading : loading}
            >
              {token ? "儲存" : "下一步"}
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </>
  );
};

ResetPassword.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ResetPassword;
