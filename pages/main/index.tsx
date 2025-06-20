import Box from "@mui/material/Box";
import Divider from "@mui/material/Divider";
import Alert from "@mui/material/Alert";
import LocalMallOutlinedIcon from "@mui/icons-material/LocalMallOutlined";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import OutlinedFlagIcon from "@mui/icons-material/OutlinedFlag";
import PieChartOutlineOutlinedIcon from "@mui/icons-material/PieChartOutlineOutlined";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import ShoppingCartOutlinedIcon from "@mui/icons-material/ShoppingCartOutlined";
import GroupsOutlinedIcon from "@mui/icons-material/GroupsOutlined";
import IconBreadcrumbs from "@components/BreadCrumbs";
import OverviewCard, { OverviewCardProps } from "@components/OverviewCard";
import AnnualPrice from "@components/AnnualPrice";
import { Card, Grid } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useMemo, useState } from "react";
import Head from "next/head";
import { useDashboard } from "@utils/hooks/queries/useDashboard";
import TurnoverChart from "@components/Dashboard/TurnoverChart";
import UserContractExpiredPanel from "@components/Dashboard/UserContractExpiredPanel";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";
import RemainingDemandFromUserContractPanel from "@components/Dashboard/RemainingDemandFromUserContractPanel";
import RemainingDemandFromCompanyContractPanel from "@components/Dashboard/RemainingDemandFromCompanyContractPanel";
import { useTpcBillMonthlyTransferDegrees } from "@utils/hooks/queries";

// Constants for consistent spacing
const CARD_PADDING = "36px";
const GRID_SPACING = 4;
const SECTION_MARGIN = "24px 0";
const GRID_TOP_MARGIN = "4px";

function useDashboardData(data: any) {
  return useMemo(() => {
    const industryOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "發電業資訊",
      basicInfos: data?.dashboard?.companyInfo
        ? [
            {
              icon: BoltIcon,
              name: "發電業數量",
              count: data.dashboard.companyInfo.totalCompanies,
              unit: "家",
            },
            {
              icon: LocalMallOutlinedIcon,
              name: "電廠數量",
              count: data.dashboard.companyInfo.totalPowerPlants,
              unit: "座",
            },
            {
              icon: PieChartOutlineOutlinedIcon,
              name: "總裝置量",
              count: data.dashboard.companyInfo.totalVolume,
              unit: "MW",
            },
          ]
        : [],
    };

    const userOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "用戶資訊",
      basicInfos: data?.dashboard?.userInfo
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
}

function MainPage() {
  const { data, loading, error } = useDashboard();
  const { industryOverview, userOverview } = useDashboardData(data);

  const [year, setYear] = useState<Date>(new Date());
  const { data: monthlyTpcTransferDegreeData, loading: tpcBillLoading } =
  useTpcBillMonthlyTransferDegrees({
    startedAt: `${year.getFullYear()}-01-01`,
    endedAt: `${year.getFullYear()}-12-31`,
  });

  if (error) {
    return (
      <AuthLayout>
        <Head>
          <title>戰情總版</title>
          <meta name="description" content="戰情總版" />
        </Head>
        <Alert severity="error">
          載入戰情總版資料時發生錯誤，請稍後再試。
        </Alert>
      </AuthLayout>
    );
  }

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
        <Grid container spacing={GRID_SPACING} marginTop={GRID_TOP_MARGIN}>
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
            <Card sx={{ p: CARD_PADDING }}>
              <AnnualPrice
                averagePurchasePrice={
                  data?.dashboard?.companyInfo?.averagePurchasePrice?.toString() ??
                  "N/A"
                }
                averageSellingPrice={
                  data?.dashboard?.userContractInfo?.averageSellingPrice?.toString() ??
                  "N/A"
                }
                loading={loading}
              />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <TurnoverChart
                name="營業額"
                data={data?.dashboard?.userBillInfo?.turnover}
                loading={loading}
              />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <TransferDegreeChart
                name="轉供度數"
                data={monthlyTpcTransferDegreeData?.tpcBillMonthlyTransferDegrees?.monthlyTotals}
                loading={tpcBillLoading}
                year={year}
                setYear={setYear}
              />
            </Card>
          </Grid>
        </Grid>

        <Divider sx={{ margin: SECTION_MARGIN }} />

        <Grid container spacing={GRID_SPACING} marginTop={GRID_TOP_MARGIN}>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <RemainingDemandFromUserContractPanel
                loading={loading}
                userContracts={
                  data?.dashboard?.userContractInfo
                    ?.remainingDemandFromUserContracts ?? []
                }
              />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <RemainingDemandFromCompanyContractPanel
                loading={loading}
                companyContracts={
                  data?.dashboard?.companyContractInfo
                    ?.remainingDemandFromCompanyContracts ?? []
                }
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={GRID_SPACING} marginTop={GRID_TOP_MARGIN}>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <UserContractExpiredPanel
                loading={loading}
                userContracts={
                  data?.dashboard?.userContractInfo?.userContractsExpiringSoon ??
                  []
                }
              />
            </Card>
          </Grid>
          <Grid item sm={6}>
            {/* Placeholder for future company contract expiry panel */}
            <Box
              sx={{
                height: "100%",
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                color: "text.secondary",
                fontStyle: "italic",
              }}
            >
              未來功能：電廠合約到期名單
            </Box>
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
