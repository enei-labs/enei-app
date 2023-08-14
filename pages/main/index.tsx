import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import MailIcon from "@mui/icons-material/Mail";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import IconBreadcrumbs from "@components/BreadCrumbs";
import OverviewCard, { OverviewCardProps } from "@components/OverviewCard";
import AnnualPrice from "@components/AnnualPrice";
import { Card, Grid } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useMemo } from "react";
import PeopleOutlineOutlinedIcon from "@mui/icons-material/PeopleOutlineOutlined";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import Head from "next/head";
import { BasicTable } from "@components/Table";
import DemoChart from "@components/LineChart";
import { useDashboard } from "@utils/hooks/queries/useDashboard";

function MainPage() {
  const { data, loading } = useDashboard();

  console.log({ data });

  const dashboardData = useMemo(() => {
    const industryOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "發電業資訊",
      basicInfos: data
        ? [
            {
              icon: BoltIcon,
              name: "發電業數量",
              count: data.dashboard.companyInfo.count,
              unit: "家",
            },
            {
              icon: MailIcon,
              name: "總裝置量",
              count: Number(data.dashboard.companyInfo.totalVolume),
              unit: "MW",
            },
            {
              icon: BoltIcon,
              name: "平均每kW發電度數",
              count: Number(data.dashboard.companyInfo.totalDegree),
              unit: "kWh",
            },
          ]
        : [],
    };

    /** @TODO user data */
    const userOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "用戶資訊",
      basicInfos: data
        ? [
            {
              icon: PeopleOutlineOutlinedIcon,
              name: "用戶數量",
              count: data.dashboard.userInfo.count,
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
              name: "今年售出總度數",
              count: 796885,
              unit: "MW",
            },
          ]
        : [],
    };

    return {
      industryOverview,
      userOverview,
    };
  }, [data]);

  const { industryOverview, userOverview } = dashboardData;

  return (
    <>
      <Head>
        <title>戰情總版</title>
        <meta name="description" content="戰情總版" />
      </Head>
      <>
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
                gap: "20px",
              }}
            >
              <OverviewCard {...industryOverview} loading={loading} />
              <OverviewCard {...userOverview} loading={loading} />
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
        <Grid container spacing={4} marginTop="4px">
          <Grid item sm={6}>
            <Card sx={{ p: "36px" }}>
              <BasicTable title="容量不足用戶名單" />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: "36px" }}>
              <BasicTable title="容量剩餘發電業名單" />
            </Card>
          </Grid>
        </Grid>
      </>
    </>
  );
}

MainPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MainPage;
