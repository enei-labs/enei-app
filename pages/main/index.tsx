import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import BoltOutlinedIcon from '@mui/icons-material/BoltOutlined';
import Inventory2OutlinedIcon from '@mui/icons-material/Inventory2Outlined';
import PieChartOutlinedIcon from '@mui/icons-material/PieChartOutlined';
import GroupsOutlinedIcon from '@mui/icons-material/GroupsOutlined';
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import IconBreadcrumbs from "@components/BreadCrumbs";
import OverviewCard, { OverviewCardProps } from "@components/OverviewCard";
import AnnualPrice from "@components/AnnualPrice";
import { Card, Grid } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useMemo } from "react";
import Head from "next/head";
import { useDashboard } from "@utils/hooks/queries/useDashboard";
import TurnoverChart from "@components/Dashboard/TurnoverChart";
import UserContractExpiredPanel from "@components/Dashboard/UserContractExpiredPanel";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";
import RemainingDemandFromUserContractPanel from "@components/Dashboard/RemainingDemandFromUserContractPanel";
import RemainingDemandFromCompanyContractPanel from "@components/Dashboard/RemainingDemandFromCompanyContractPanel";
import { createTheme, ThemeProvider } from "@mui/material/styles";

function MainPage() {
  const { data, loading } = useDashboard();

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

  const dashboardData = useMemo(() => {
    const industryOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "發電業資訊",
      basicInfos: data
        ? [
            {
              icon: BoltOutlinedIcon,
              name: "發電業數量",
              count: data.dashboard.companyInfo.totalCompanies,
              unit: "家",
            },
            {
              icon: Inventory2OutlinedIcon,
              name: "電廠數量",
              count: data.dashboard.companyInfo.totalPowerPlants,
              unit: "座",
            },
            {
              icon: PieChartOutlinedIcon,
              name: "總裝置量",
              count: Number(data.dashboard.companyInfo.totalVolume),
              unit: "MW",
            },
          ]
        : [],
    };

    const userOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "用戶資訊",
      basicInfos: data
        ? [
            {
              icon: GroupsOutlinedIcon,
              name: "用戶數量",
              count: data.dashboard.userInfo.count,
              unit: "位",
            },
            {
              icon: ChartIcon,
              name: "年度用戶成長數",
              count: data.dashboard.userInfo.yearlyGrowth,
              unit: "位",
            },
            {
              icon: ShoppingCartOutlinedIcon,
              name: "今年總綠電需求度數",
              count: data.dashboard.userInfo.totalRequireDegree,
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
        <ThemeProvider theme={iconColorTheme}>
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
                <AnnualPrice
                  averagePurchasePrice={
                    data?.dashboard.companyInfo.averagePurchasePrice.toString() ??
                    "N/A"
                  }
                  averageSellingPrice={
                    data?.dashboard.userContractInfo.averageSellingPrice.toString() ??
                    "N/A"
                  }
                />
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <TurnoverChart
                  name="營業額"
                  data={data?.dashboard.userBillInfo.turnover}
                />
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <TransferDegreeChart
                  name="轉供度數"
                  data={data?.dashboard.transferDegreeInfo.monthlyTransferDegree}
                />
              </Card>
            </Grid>
          </Grid>

          <Divider sx={{ margin: "24px 0" }} />

          <Grid container spacing={4} marginTop="4px">
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <RemainingDemandFromUserContractPanel
                  loading={loading}
                  userContracts={
                    data?.dashboard.userContractInfo
                      .remainingDemandFromUserContracts ?? []
                  }
                />
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <RemainingDemandFromCompanyContractPanel
                  loading={loading}
                  companyContracts={
                    data?.dashboard.companyContractInfo
                      .remainingDemandFromCompanyContracts ?? []
                  }
                />
              </Card>
            </Grid>
          </Grid>

          <Grid container spacing={4} marginTop="4px">
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                <UserContractExpiredPanel
                  loading={loading}
                  userContracts={
                    data?.dashboard.userContractInfo.userContractsExpiringSoon ??
                    []
                  }
                />
              </Card>
            </Grid>
            <Grid item sm={6}>
              <Card sx={{ p: "36px" }}>
                {/* <BasicTable title="未來一年電廠合約到期名單" /> */}
              </Card>
            </Grid>
          </Grid>
        </ThemeProvider>
      </>
    </>
  );
}

MainPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MainPage;
