import Box from "@mui/material/Box";
import Alert from "@mui/material/Alert";
import Typography from "@mui/material/Typography";
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
import UserContractExpiredPanel from "@components/Dashboard/UserContractExpiredPanel";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";
import RemainingDemandFromUserContractPanel from "@components/Dashboard/RemainingDemandFromUserContractPanel";
import RemainingDemandFromCompanyContractPanel from "@components/Dashboard/RemainingDemandFromCompanyContractPanel";
import PageErrorBoundary from "@components/ErrorBoundary/PageErrorBoundary";
import {
  useCompanyStats,
  useUserStats,
  useTransferDegreesByMonth,
  useExpiringUserContracts,
  useUserContractsWithRemainingDemand,
  useCompanyContractsWithRemainingCapacity,
  useTpcBillMonthlyTransferDegrees,
} from "@utils/hooks/queries";

const CARD_PADDING = "36px";
const GRID_SPACING = 4;
const GRID_TOP_MARGIN = "4px";

function useOverviewCards(
  companyStatsData: any,
  userStatsData: any,
) {
  return useMemo(() => {
    const industryOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "發電業資訊",
      basicInfos: companyStatsData?.companyStats
        ? [
            { icon: BoltIcon, name: "發電業數量",
              count: companyStatsData.companyStats.totalCompanies, unit: "家" },
            { icon: LocalMallOutlinedIcon, name: "電廠數量",
              count: companyStatsData.companyStats.totalPowerPlants, unit: "座" },
            { icon: PieChartOutlineOutlinedIcon, name: "總裝置量",
              count: companyStatsData.companyStats.totalVolume, unit: "MW" },
          ]
        : [],
    };

    const userOverview: Pick<OverviewCardProps, "topic" | "basicInfos"> = {
      topic: "用戶資訊",
      basicInfos: userStatsData?.userStats
        ? [
            { icon: GroupsOutlinedIcon, name: "用戶數量",
              count: userStatsData.userStats.count, unit: "位" },
            { icon: ChartIcon, name: "年度用戶成長數",
              count: userStatsData.userStats.yearlyGrowth, unit: "位" },
            { icon: ShoppingCartOutlinedIcon, name: "今年總綠電需求度數",
              count: userStatsData.userStats.totalRequireDegree, unit: "度" },
          ]
        : [],
    };

    return { industryOverview, userOverview };
  }, [companyStatsData, userStatsData]);
}

function TurnoverPlaceholder() {
  return (
    <Box
      sx={{
        height: "100%",
        display: "flex",
        alignItems: "center",
        justifyContent: "center",
        minHeight: 240,
      }}
    >
      <Typography color="text.secondary">營業額資料整理中</Typography>
    </Box>
  );
}

function MainPage() {
  const [year, setYear] = useState<Date>(new Date());

  const { data: companyStatsData, loading: companyLoading, error: companyError } = useCompanyStats();
  const { data: userStatsData, loading: userLoading, error: userError } = useUserStats();
  const { data: transferDegreeData, loading: transferLoading } =
    useTransferDegreesByMonth({ year: year.getFullYear() });
  const { data: monthlyTpcTransferDegreeData, loading: tpcBillLoading } =
    useTpcBillMonthlyTransferDegrees({
      startedAt: `${year.getFullYear()}-01-01`,
      endedAt: `${year.getFullYear()}-12-31`,
    });
  const { data: expiringData, loading: expiringLoading } = useExpiringUserContracts();
  const { data: userRemainingData, loading: userRemainingLoading } =
    useUserContractsWithRemainingDemand();
  const { data: companyRemainingData, loading: companyRemainingLoading } =
    useCompanyContractsWithRemainingCapacity();

  const { industryOverview, userOverview } = useOverviewCards(companyStatsData, userStatsData);

  return (
    <PageErrorBoundary>
      <Head>
        <title>戰情總版</title>
        <meta name="description" content="戰情總版" />
      </Head>
      <>
        <IconBreadcrumbs
          items={[{ name: "戰情總版", icon: OutlinedFlagIcon, href: "/main" }]}
        />
        <Grid container spacing={GRID_SPACING} marginTop={GRID_TOP_MARGIN}>
          <Grid item sm={7}>
            <Box sx={{
              display: "flex", flexDirection: "column", height: "100%",
              justifyContent: "space-between", gap: "20px",
            }}>
              {companyError ? (
                <Alert severity="error">發電業資訊載入失敗</Alert>
              ) : (
                <OverviewCard {...industryOverview} loading={companyLoading} />
              )}
              {userError ? (
                <Alert severity="error">用戶資訊載入失敗</Alert>
              ) : (
                <OverviewCard {...userOverview} loading={userLoading} />
              )}
            </Box>
          </Grid>
          <Grid item sm={5}>
            <Card sx={{ p: CARD_PADDING }}>
              <AnnualPrice
                averagePurchasePrice={
                  companyStatsData?.companyStats?.averagePurchasePrice?.toString() ?? "N/A"
                }
                averageSellingPrice={
                  userStatsData?.userStats?.averageSellingPrice?.toString() ?? "N/A"
                }
                loading={companyLoading || userLoading}
              />
            </Card>
          </Grid>

          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <TurnoverPlaceholder />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <TransferDegreeChart
                name="轉供度數"
                data={monthlyTpcTransferDegreeData?.tpcBillMonthlyTransferDegrees?.monthlyTotals}
                loading={tpcBillLoading || transferLoading}
                year={year}
                setYear={setYear}
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={GRID_SPACING} marginTop={GRID_TOP_MARGIN}>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <RemainingDemandFromUserContractPanel
                loading={userRemainingLoading}
                userContracts={
                  userRemainingData?.userContractsWithRemainingDemand ?? []
                }
              />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <RemainingDemandFromCompanyContractPanel
                loading={companyRemainingLoading}
                companyContracts={
                  companyRemainingData?.companyContractsWithRemainingCapacity ?? []
                }
              />
            </Card>
          </Grid>
        </Grid>

        <Grid container spacing={GRID_SPACING} marginTop={GRID_TOP_MARGIN}>
          <Grid item sm={6}>
            <Card sx={{ p: CARD_PADDING }}>
              <UserContractExpiredPanel
                loading={expiringLoading}
                userContracts={expiringData?.expiringUserContracts ?? []}
              />
            </Card>
          </Grid>
          <Grid item sm={6}>
            <Box sx={{
              height: "100%", display: "flex", alignItems: "center",
              justifyContent: "center", color: "text.secondary", fontStyle: "italic",
            }}>
              未來功能：電廠合約到期名單
            </Box>
          </Grid>
        </Grid>
      </>
    </PageErrorBoundary>
  );
}

MainPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default MainPage;
