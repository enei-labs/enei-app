import AccountCircleOutlinedIcon from "@mui/icons-material/AccountCircleOutlined";
import PersonOutlineOutlinedIcon from "@mui/icons-material/PersonOutlineOutlined";
import HomeOutlinedIcon from "@mui/icons-material/HomeOutlined";
import EmailOutlinedIcon from "@mui/icons-material/EmailOutlined";
import BorderColorOutlinedIcon from "@mui/icons-material/BorderColorOutlined";
import { AuthLayout } from "@components/Layout";
import {
  Box,
  Card,
  Container,
  Divider,
  Grid, Typography
} from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import dynamic from "next/dynamic";
import { SvgIconComponent } from "@mui/icons-material";
import InfoBox from "@components/InfoBox";
import CreditCardIcon from "@mui/icons-material/CreditCard";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { createTheme, ThemeProvider } from "@mui/material/styles";

const iconColorTheme = createTheme(
  {
    components: {
      MuiSvgIcon: {
        styleOverrides: {
          root: {
            color: "#009668"
          }
        }
      }
    }
  }
);

const SettingDialog = dynamic(
  () => import("@components/Settings/SettingDialog")
);

enum ProfileInfoType {
  USER_NAME = "用戶名稱",
  ACCOMPANY_NAME = "公司名稱",
  USER_EMAIL = "用戶信箱",
}

const ProfileWithIcons = (props: {
  icon: SvgIconComponent;
  type: ProfileInfoType;
  text: string;
}) => {
  const { icon: Icon, type, text } = props;

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

/** @TODO 銀行/分行名稱 */
const Settings = () => {
  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);
  const { me } = useAuth();

  return (
    <>
      <Head>
        <title>帳戶設定</title>
        <meta name="description" content="帳戶設定" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "帳戶設定",
            icon: AccountCircleOutlinedIcon,
            href: "/settings",
          },
        ]}
      />
      <ThemeProvider theme={iconColorTheme}>
        <Box sx={{ paddingTop: "12px" }}>
          <Card>
            <Box margin="36px 32px">
              <Grid container justifyContent={"space-between"}>
                <Typography variant="h4">帳戶資料</Typography>
                <IconBtn
                  icon={<BorderColorOutlinedIcon />}
                  onClick={() => {
                    setIsOpenDialog(true);
                  }}
                />
              </Grid>
            </Box>

            {me ? (
              <Box display="flex" marginBottom="36px">
                <Container sx={{ margin: "32px 0", flex: 1 }}>
                  <Typography variant="h5">個人資料</Typography>
                  <Grid
                    container
                    direction={"column"}
                    spacing={2}
                    justifyContent={"center"}
                    sx={{ marginTop: "12px" }}
                  >
                    <ProfileWithIcons
                      icon={PersonOutlineOutlinedIcon}
                      type={ProfileInfoType.USER_NAME}
                      text={me.name}
                    />
                    <ProfileWithIcons
                      icon={HomeOutlinedIcon}
                      type={ProfileInfoType.ACCOMPANY_NAME}
                      text={me.companyName ?? ""}
                    />
                    <ProfileWithIcons
                      icon={EmailOutlinedIcon}
                      type={ProfileInfoType.USER_EMAIL}
                      text={me.email}
                    />
                  </Grid>
                </Container>

                <Divider orientation="vertical" flexItem />

                <Container sx={{ margin: "32px 0", flex: 1 }}>
                  <Typography variant="h5">收款帳戶</Typography>
                  <Box
                    sx={{
                      marginTop: "12px",
                      display: "flex",
                      flexDirection: "column",
                      rowGap: "8px",
                    }}
                  >
                    {(me.recipientAccounts ?? []).map((recipientAccount) => (
                      <Grid
                        container
                        key={recipientAccount.account}
                        sx={{
                          border: "2px solid #B2DFDB",
                          borderRadius: "4px",
                          padding: "8px 16px",
                        }}
                      >
                        <Grid item sm={4}>
                          <InfoBox
                            icon={CreditCardIcon}
                            label="銀行"
                            content={`${recipientAccount.bankCode}`}
                          />
                        </Grid>
                        <Grid item sm={4}>
                          <InfoBox
                            icon={AccountCircleOutlinedIcon}
                            label="戶名"
                            content={recipientAccount.accountName}
                          />
                        </Grid>
                        <Grid item sm={4}>
                          <InfoBox
                            icon={AccountBalanceWalletOutlinedIcon}
                            label="帳號"
                            content={recipientAccount.account}
                          />
                        </Grid>
                      </Grid>
                    ))}
                  </Box>
                </Container>
              </Box>
            ) : null}
          </Card>
        </Box>
      </ThemeProvider>

      {isOpenDialog ? (
        <SettingDialog
          isOpenDialog={isOpenDialog}
          onClose={() => setIsOpenDialog(false)}
        />
      ) : null}
    </>
  );
};

Settings.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Settings;
