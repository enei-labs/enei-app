import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
  Alert,
} from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import dynamic from "next/dynamic";
import UserBillConfigDialog from "@components/UserBill/UserBillConfigDialog/UserBillConfigDialog";

import { useFee } from "@utils/hooks/queries";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import AccountBalanceWalletOutlinedIcon from "@mui/icons-material/AccountBalanceWalletOutlined";
import { IconBtn } from "@components/Button";
import { useSearch } from "@utils/hooks/useSearch";
import UserBillConfigPanel from "@components/UserBill/UserBillConfigPanel";
import IndustryBillConfigDialog from "@components/IndustryBill/IndustryBillConfigDialog/IndustryBillConfigDialog";
import IndustryBillConfigPanel from "@components/IndustryBill/IndustryBillConfigPanel";
import { UserBillsByMonthPanel } from "@components/UserBill/UserBillsByMonthPanel";
import { IndustryBillsByMonthPanel } from "@components/IndustryBill/IndustryBillsByMonthPanel";

const FeeDialog = dynamic(() => import("@components/UserBill/FeeDialog"));

const styles = {
  box: {
    backgroundColor: "primary.light",
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    borderRadius: "10px",
    height: "172px",
    marginTop: "10px",
  },
} as const;

interface FeeCardProps {
  title: string;
  value: string | number | null | undefined;
  unit: string;
}

function FeeCard({ title, value, unit }: FeeCardProps) {
  return (
    <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
      <Box sx={{ display: "flex", columnGap: "12px" }}>
        <AccountBalanceWalletOutlinedIcon
          sx={{ color: "#009688" }}
          width="20px"
        />
        <Typography variant="body2">{title}</Typography>
      </Box>
      <Box sx={styles.box}>
        <Box
          sx={{
            display: "flex",
            alignItems: "flex-end",
            margin: "40px",
            columnGap: "4px",
          }}
        >
          <Typography variant="h3" sx={{ whiteSpace: "nowrap" }}>
            {value ?? "-"}
          </Typography>
          <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
            {unit}
          </Typography>
        </Box>
      </Box>
    </Grid>
  );
}

function ExportElectricBillPage() {
  const [showUserBillConfigDialog, setShowUserBillConfigDialog] =
    useState(false);
  const [showIndustryBillConfigDialog, setShowIndustryBillConfigDialog] =
    useState(false);
  const [showFeeDialog, setShowFeeDialog] = useState(false);
  const { data, loading, error } = useFee();

  const { searchTerm: industryBillConfigSearchTerm, setInputValue: setIndustryBillConfigInputValue, executeSearch: executeIndustryBillConfigSearch } = useSearch();
  const { searchTerm: userBillConfigSearchTerm, setInputValue: setUserBillConfigInputValue, executeSearch: executeUserBillConfigSearch } = useSearch();

  return (
    <>
      <Head>
        <title>電費單匯出</title>
        <meta name="description" content="電費單匯出" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "電費單匯出",
            icon: InboxOutlinedIcon,
            href: "/electric-bill",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
          {error && (
            <Alert severity="error" sx={{ mb: 2 }}>
              載入規費資料時發生錯誤，請稍後再試。
            </Alert>
          )}
          
          <Card sx={{ p: "36px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h4">規費設定</Typography>
              <IconBtn
                icon={<BorderColorOutlined />}
                onClick={() => setShowFeeDialog(true)}
                aria-label="編輯規費設定"
              />
            </Box>
            {loading ? (
              <Box sx={{ display: "flex", justifyContent: "center", py: 4 }}>
                <CircularProgress size="24px" />
              </Box>
            ) : (
              <Grid container>
                <FeeCard
                  title="代輸費"
                  value={data?.fee.substitutionFee}
                  unit="元/kWh"
                />
                <FeeCard
                  title="憑證審查費"
                  value={data?.fee.certificateVerificationFee}
                  unit="元/kWh"
                />
                <FeeCard
                  title="憑證服務費"
                  value={data?.fee.certificateServiceFee}
                  unit="元/kWh"
                />
              </Grid>
            )}
          </Card>

          <Divider sx={{ margin: "36px 0 " }} />

          <Card sx={{ p: "36px" }}>
            <Typography variant="h4">用戶電費單組合</Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                my: "16px",
              }}
            >
              <InputSearch
                onChange={setUserBillConfigInputValue}
                onEnter={executeUserBillConfigSearch}
                placeholder="搜尋用戶電費單組合"
              />

              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowUserBillConfigDialog(true)}
              >
                新增用戶電費單組合
              </Button>
            </Box>

            {data?.fee ? (
              <UserBillConfigPanel fee={data.fee} searchTerm={userBillConfigSearchTerm} />
            ) : null}
          </Card>

          <UserBillsByMonthPanel />
          <Divider sx={{ my: "24px" }} />

          <Card sx={{ p: "36px" }}>
            <Typography variant="h4">發電業電費單組合</Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                my: "16px",
              }}
            >
              <InputSearch
                onChange={setIndustryBillConfigInputValue}
                onEnter={executeIndustryBillConfigSearch}
                placeholder="搜尋發電業電費單組合"
              />

              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowIndustryBillConfigDialog(true)}
              >
                新增發電業電費單組合
              </Button>
            </Box>

            {data?.fee ? (
              <IndustryBillConfigPanel fee={data.fee} searchTerm={industryBillConfigSearchTerm} />
            ) : null}
          </Card>

          <IndustryBillsByMonthPanel />
        </AuthGuard>
      </Box>
      {showUserBillConfigDialog ? (
        <UserBillConfigDialog
          isOpenDialog={showUserBillConfigDialog}
          variant="create"
          onClose={() => setShowUserBillConfigDialog(false)}
        />
      ) : null}
      {showIndustryBillConfigDialog ? (
        <IndustryBillConfigDialog
          isOpenDialog={showIndustryBillConfigDialog}
          variant="create"
          onClose={() => setShowIndustryBillConfigDialog(false)}
        />
      ) : null}
      {showFeeDialog ? (
        <FeeDialog
          isOpenDialog={showFeeDialog}
          onClose={() => setShowFeeDialog(false)}
        />
      ) : null}
    </>
  );
}

ExportElectricBillPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ExportElectricBillPage;
