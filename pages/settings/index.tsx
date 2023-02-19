import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { AuthLayout } from "@components/Layout";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import {
  Alert,
  Box,
  Button,
  Card,
  Container,
  Grid,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { FieldsController } from "@components/Controller";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import Dialog from "@components/Dialog";
import { ActionBtn, IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { CancelOutlined } from "@mui/icons-material";
import { useAuth } from "@core/context/auth";
import { useModifyProfile } from "@utils/hooks/mutations/useModifyProfile";

enum ProfileInfoType {
  USER_NAME = "用戶名稱",
  ACCOMPANY_NAME = "公司名稱",
  USER_EMAIL = "用戶信箱",
}

type FormData = {
  name: string;
  company_name: string;
  email: string;
};

const ProfileWithIcons = (props: {
  Icon: React.ElementType;
  type: ProfileInfoType;
  text: string;
}) => {
  const { Icon, type, text } = props;

  return (
    <Grid item>
      <Grid container direction={"row"} spacing={1} alignItems={"center"}>
        <Grid item>
          <Icon />
        </Grid>

        <Grid item>
          <Grid container direction={"column"} spacing={0.5}>
            <Grid item>
              <Typography variant="body4">{type}</Typography>
            </Grid>
            <Grid item>
              <Typography variant="h6">{text}</Typography>
            </Grid>
          </Grid>
        </Grid>
      </Grid>
    </Grid>
  );
};

const Settings = () => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const [isModifySuccess, setIsModifySuccess] = useState<boolean>(false);

  const { me, logIn } = useAuth();

  const settingsFieldConfigs: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "用戶名稱",
      validated: textValidated,
    },
    {
      type: "TEXT",
      name: "company_name",
      label: "公司名稱",
      disabled: true,
    },
    {
      type: "TEXT",
      name: "email",
      label: "用戶信箱",
      validated: textValidated,
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(settingsFieldConfigs, {
    defaultValues: {
      name: me?.name,
      company_name: me?.companyName,
      email: me?.email,
    },
  });

  const [modifyProfile] = useModifyProfile();

  const onSubmit = async (formData: FormData) => {
    await modifyProfile({
      variables: {
        name: formData.name,
        email: formData.email,
      },
    });

    // refetch 用戶資料
    logIn();
    setIsOpenDialog(false);
    setIsModifySuccess(true);
  };

  return (
    <>
      <Head>
        <title>帳戶設定</title>
        <meta name="description" content="帳戶設定" />
      </Head>
      <Toolbar></Toolbar>
      <IconBreadcrumbs
        items={[
          {
            name: "帳戶設定",
            icon: AccountCircleOutlinedIcon,
            href: "/settings",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <Card>
          <Box
            sx={{ marginTop: "44px", marginLeft: "32px", marginRight: "32px" }}
          >
            <Grid
              container
              justifyContent={"space-between"}
              // sx={{ width: "100%" }}
            >
              <Typography variant="h4">個人資料</Typography>
              <IconBtn
                icon={<BorderColorOutlinedIcon />}
                onClick={() => {
                  setIsOpenDialog(true);
                }}
              />
            </Grid>
          </Box>

          <Container sx={{ margin: "32px 0" }}>
            <Grid
              container
              direction={"column"}
              spacing={2}
              justifyContent={"center"}
              sx={{ padding: "0 10px" }}
            >
              <ProfileWithIcons
                Icon={PersonOutlineOutlinedIcon}
                type={ProfileInfoType.USER_NAME}
                text={me?.name || ""}
              ></ProfileWithIcons>
              <ProfileWithIcons
                Icon={HomeOutlinedIcon}
                type={ProfileInfoType.ACCOMPANY_NAME}
                text={me?.companyName || ""}
              ></ProfileWithIcons>
              <ProfileWithIcons
                Icon={EmailOutlinedIcon}
                type={ProfileInfoType.USER_EMAIL}
                text={me?.email || ""}
              ></ProfileWithIcons>
            </Grid>
          </Container>
        </Card>
      </Box>

      {/* 修改個人資料彈窗 */}
      <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            修改個人資料
          </Typography>
          <IconBtn
            icon={<HighlightOffIcon />}
            onClick={() => {
              setIsOpenDialog(false);
            }}
          />
        </Grid>
        <Typography variant="h5" textAlign={"left"}>
          個人資料
        </Typography>
        <FieldsController
          configs={settingsFieldConfigs}
          form={{ control, errors }}
        />
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          <Button
            startIcon={<SaveOutlinedIcon />}
            onClick={handleSubmit(onSubmit)}
          >
            儲存
          </Button>
          <Button
            startIcon={<CancelOutlined />}
            sx={{
              "&.MuiButton-text": {
                backgroundColor: "transparent",
                background: "primary.dark",
                color: "primary.dark",
              },
              ".MuiButton-startIcon": {
                svg: {
                  color: "primary.dark",
                },
              },
            }}
            onClick={() => {
              setIsOpenDialog(false);
            }}
          >
            取消
          </Button>
        </Grid>
      </Dialog>

      {/* 修改成功 Toast */}
      <Snackbar
        open={isModifySuccess}
        autoHideDuration={6000}
        onClose={() => {
          setIsModifySuccess(false);
        }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Alert
          onClose={() => {
            setIsModifySuccess(false);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          修改成功！
        </Alert>
      </Snackbar>
    </>
  );
};

Settings.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Settings;
