import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import { AuthLayout, Layout } from "@components/Layout";
import { Box, Card, Typography } from "@mui/material";
import { ReactElement, useEffect, useState } from "react";
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
  const [requestResetPassword, { loading }] = useRequestResetPassword();
  const [resetPassword, { loading: resetLoading }] = useResetPassword();

  const configs = token ? fieldConfigs.slice(1) : fieldConfigs.slice(0, 1);

  useEffect(() => {
    if (_token) setToken(_token);
  }, [_token]);

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
          onError: () => toast.error("驗證信已過期，請聯繫管理員重新寄驗證信"),
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
      <IconBreadcrumbs
        items={[
          {
            name: "修改密碼",
            icon: AccountCircleOutlinedIcon,
            href: "/reset-password",
          },
        ]}
      />
      <Box 
        sx={{ 
          paddingTop: "12px",
          display: "flex",
          justifyContent: "center",
          alignItems: "flex-start",
          minHeight: "calc(100vh - 200px)",
          px: 2,
        }}
      >
        <Card 
          sx={{ 
            p: "48px",
            maxWidth: "500px",
            width: "100%",
            boxShadow: 3,
            borderRadius: 2,
          }}
        >
          <Box
            sx={{
              display: "flex",
              flexDirection: "column",
              alignItems: "center",
              gap: "24px",
            }}
          >
            {/* 標題區域 */}
            <Box sx={{ textAlign: "center", mb: 2 }}>
              <AccountCircleOutlinedIcon 
                sx={{ 
                  fontSize: 60,
                  color: "primary.main",
                  mb: 2,
                }}
              />
              <Typography variant="h4" gutterBottom>
                修改密碼
              </Typography>
              <Typography variant="body2" color="text.secondary">
                {token ? "設定您的新密碼" : "請輸入舊密碼以繼續"}
              </Typography>
            </Box>

            {/* 表單區域 */}
            <Box sx={{ width: "100%" }}>
              <FieldsController 
                configs={configs} 
                form={{ control, errors }} 
              />
            </Box>

            {/* 按鈕區域 */}
            <LoadingButton
              startIcon={<LoginIcon />}
              onClick={handleSubmit(onSubmit)}
              variant="contained"
              loading={token ? resetLoading : loading}
              fullWidth
              size="large"
              sx={{ mt: 2 }}
            >
              {token ? "儲存新密碼" : "下一步"}
            </LoadingButton>
          </Box>
        </Card>
      </Box>
    </>
  );
};

ResetPassword.getLayout = (page: ReactElement, loggedIn: boolean) => {
  if (loggedIn) {
    return <AuthLayout>{page}</AuthLayout>;
  }
  return <Layout>{page}</Layout>;
};

const withAuthLayout = (WrappedComponent: any) => {
  return (props: any) => {
    const { me } = useAuth();

    const layoutPage = WrappedComponent.getLayout(
      <WrappedComponent {...props} />,
      !!me
    );
    return layoutPage;
  };
};

export default withAuthLayout(ResetPassword);
