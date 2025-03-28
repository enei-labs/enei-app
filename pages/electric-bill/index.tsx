import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Grid,
  Typography,
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
import Link from "next/link";
import { useSearch } from "@utils/hooks/useSearch";
import ImportExportOutlinedIcon from "@mui/icons-material/ImportExportOutlined";
import UserBillConfigPanel from "@components/UserBill/UserBillConfigPanel";
import IndustryBillConfigDialog from "@components/IndustryBill/IndustryBillConfigDialog/IndustryBillConfigDialog";
import IndustryBillConfigPanel from "@components/IndustryBill/IndustryBillConfigPanel";
import UserBillPanel from "@components/UserBill/UserBillPanel";

const TransferDocumentDialog = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/TransferDocumentDialog"
    )
);

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

function ExportElectricBillPage() {
  const {
    searchTerm: userBillSearchTerm,
    setInputValue: setUserBillInputValue,
    executeSearch: executeUserBillSearch,
  } = useSearch();
  const {
    searchTerm: industryBillSearchTerm,
    setInputValue: setIndustryBillInputValue,
    executeSearch: executeIndustryBillSearch,
  } = useSearch();
  const [open, setOpen] = useState(false);
  const [showUserBillConfigDialog, setShowUserBillConfigDialog] =
    useState(false);
  const [showIndustryBillConfigDialog, setShowIndustryBillConfigDialog] =
    useState(false);
  const [showFeeDialog, setShowFeeDialog] = useState(false);
  const { data, loading } = useFee();

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
          <Card sx={{ p: "36px" }}>
            <Box sx={{ display: "flex", justifyContent: "space-between" }}>
              <Typography variant="h4">規費設定</Typography>
              <IconBtn
                icon={<BorderColorOutlined />}
                onClick={() => setShowFeeDialog(true)}
              />
            </Box>
            {loading ? (
              <CircularProgress size="24px" />
            ) : (
              <Grid container>
                <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
                  <Box sx={{ display: "flex", columnGap: "12px" }}>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#009688" }}
                      width="20px"
                    />
                    <Typography variant="body2">代輸費</Typography>
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
                        {data?.fee.substitutionFee ?? "-"}
                      </Typography>
                      <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                        元/kWh
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
                  <Box sx={{ display: "flex", columnGap: "12px" }}>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#009688" }}
                      width="20px"
                    />
                    <Typography variant="body2">憑證審查費</Typography>
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
                        {data?.fee.certificateVerificationFee ?? "-"}
                      </Typography>
                      <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                        元/kWh
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
                <Grid item sm={4} sx={{ padding: "36px 36px 36px 0" }}>
                  <Box sx={{ display: "flex", columnGap: "12px" }}>
                    <AccountBalanceWalletOutlinedIcon
                      sx={{ color: "#009688" }}
                      width="20px"
                    />
                    <Typography variant="body2">憑證服務費</Typography>
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
                        {data?.fee.certificateServiceFee ?? "-"}
                      </Typography>
                      <Typography variant="body3" sx={{ whiteSpace: "nowrap" }}>
                        元/kWh
                      </Typography>
                    </Box>
                  </Box>
                </Grid>
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
              {/* 搜尋 */}
              <InputSearch
                onChange={setUserBillInputValue}
                onEnter={executeUserBillSearch}
              />

              {/* 新增電費單 */}
              <Box sx={{ display: "flex", columnGap: "12px" }}>
                <Link href="/electric-bill/import">
                  <Button
                    startIcon={<ImportExportOutlinedIcon />}
                    onClick={() => setShowUserBillConfigDialog(true)}
                  >
                    匯入電費單
                  </Button>
                </Link>
                <Button
                  startIcon={<AddIcon />}
                  onClick={() => setShowUserBillConfigDialog(true)}
                >
                  新增電費單組合
                </Button>
              </Box>
            </Box>

            {/* 電費單表格 */}
            {data?.fee ? <UserBillConfigPanel fee={data.fee} /> : null}
          </Card>

          <Card sx={{ mt: "36px", p: "36px" }}>
            <Typography variant="h4">用戶電費單</Typography>
            {data?.fee ? <UserBillPanel fee={data.fee} /> : null}
          </Card>

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
              {/* 搜尋 */}
              <InputSearch
                onChange={setIndustryBillInputValue}
                onEnter={executeIndustryBillSearch}
              />

              {/* 新增電費單 */}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowIndustryBillConfigDialog(true)}
              >
                新增電費單組合
              </Button>
            </Box>

            {/* 電費單表格 */}
            {data?.fee ? <IndustryBillConfigPanel fee={data.fee} /> : null}
          </Card>

          <Card sx={{ mt: "36px", p: "36px" }}>
            <Typography variant="h4">發電業電費單</Typography>
          </Card>

          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>
      {open ? (
        <TransferDocumentDialog
          isOpenDialog={open}
          onClose={() => setOpen(false)}
          variant="create"
        />
      ) : null}
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
