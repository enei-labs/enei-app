import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MailIcon from "@mui/icons-material/Mail";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import IconBreadcrumbs from "@components/BreadCrumbs";
import OverviewCard, { OverviewCardProps } from "@components/OverviewCard";
import { Card, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import Head from "next/head";

function MainPage() {
  return (
    <>
      <Head>
        <title>戰情總版</title>
        <meta name="description" content="戰情總版" />
      </Head>
      <Box sx={{ display: "flex" }}>
        <Box
          component="main"
          sx={{ flexGrow: 1, bgcolor: "background.default", p: 3 }}
        >
          <Toolbar />
          <IconBreadcrumbs
            items={[
              {
                name: "發電業管理",
                icon: BoltIcon,
                href: "/industry",
              },
            ]}
          />
        </Box>
      </Box>
    </>
  );
}

MainPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MainPage;
