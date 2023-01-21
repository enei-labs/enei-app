import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import Divider from "@mui/material/Divider";
import MailIcon from "@mui/icons-material/Mail";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import IconBreadcrumbs from "@components/BreadCrumbs";
import OverviewCard, { OverviewCardProps } from "@components/OverviewCard";
import AnnualPrice from "@components/AnnualPrice";
import { Card, Grid } from "@mui/material";
import dynamic from "next/dynamic";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Head from "next/head";

const DemoChart = dynamic(() => import("@components/LineChart"), {
  ssr: false,
});

const industryOverview: OverviewCardProps = {
  topic: "發電業資訊",
  basicInfos: [
    {
      icon: BoltIcon,
      name: "發電業數量",
      count: 47,
      unit: "家",
    },
    {
      icon: MailIcon,
      name: "總裝置量",
      count: 796885,
      unit: "MW",
    },
    {
      icon: BoltIcon,
      name: "平均每kW發電度數",
      count: 1300,
      unit: "kWh",
    },
  ],
};

const userOverview = {
  topic: "用戶資訊",
  basicInfos: [
    {
      icon: PeopleOutlineOutlinedIcon,
      name: "用戶數量",
      count: 50,
      unit: "位",
    },
    {
      icon: ChartIcon,
      name: "年度用戶成長數",
      count: 10,
      unit: "位",
    },
    {
      icon: ShoppingCartOutlinedIcon,
      name: "售出總度數",
      count: 796885,
      unit: "MW",
    },
  ],
};

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
                name: "戰情總版",
                icon: OutlinedFlagIcon,
                href: "/main",
              },
            ]}
          />
          <Grid container spacing={4} marginTop="4px">
            <Grid item sm={7}>
              <Box
                sx={{
                  display: "flex",
                  flexDirection: "column",
                  height: "100%",
                  justifyContent: "space-between",
                }}
              >
                <OverviewCard {...industryOverview} />
                <OverviewCard {...userOverview} />
              </Box>
            </Grid>
            <Grid item sm={5}>
              <Card sx={{ p: "36px" }}>
                <AnnualPrice annualBuyPrice="5022" annualSellPrice="4022" />
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <DemoChart name="營業額" />
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <DemoChart name="轉供度數" />
              </Card>
            </Grid>
          </Grid>
          <Divider sx={{ margin: "24px 0" }} />
          <Card sx={{ p: "36px" }}>
            <DemoChart name="未來一年容量平衡" />
          </Card>
        </Box>
      </Box>
    </>
  );
}

MainPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MainPage;
