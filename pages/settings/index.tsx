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
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { IconBtn } from "@components/Button";
import { useAuth } from "@core/context/auth";
import dynamic from "next/dynamic";
import { SvgIconComponent } from "@mui/icons-material";
import InfoBox from "@components/InfoBox";

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
      <Box sx={{ paddingTop: "12px" }}>
        <Card>
          <Box margin="44px 32px">
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
            <Box display="flex">
              <Container sx={{ margin: "32px 0" }}>
                <Typography variant="h5">個人資料</Typography>
                <Grid
                  container
                  direction={"column"}
                  spacing={2}
                  justifyContent={"center"}
                  sx={{ padding: "0 10px" }}
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
              <Divider orientation="vertical" />

              <Box>
                <Typography variant="h5">收款帳戶</Typography>
                <Box>
                  {[].map((x) => (
                    <Grid container key={x.id}>
                      <Grid item sm={4} key={`${c.label}-${index}`}>
                        <InfoBox
                          icon={c.icon}
                          label={c.label}
                          content={c.content}
                        />
                      </Grid>
                      <Grid item sm={4} key={`${c.label}-${index}`}>
                        <InfoBox
                          icon={c.icon}
                          label={c.label}
                          content={c.content}
                        />
                      </Grid>
                      <Grid item sm={4} key={`${c.label}-${index}`}>
                        <InfoBox
                          icon={c.icon}
                          label={c.label}
                          content={c.content}
                        />
                      </Grid>
                    </Grid>
                  ))}
                </Box>
              </Box>
            </Box>
          ) : null}
        </Card>
      </Box>

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
