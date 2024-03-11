import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { Button, Card, CircularProgress, Divider } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";

import dynamic from "next/dynamic";
import { useTransferDocuments } from "@utils/hooks/queries";
import DemoChart from "@components/LineChart";
import TransferDocumentPanel from "@components/TransferDocument/TransferDocumentPanel";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";
import { useMonthlyTransferDegrees } from "@utils/hooks/queries/useMonthlyTransferDegrees";

const TPCBillDialog = dynamic(
  () => import("@components/TPCBill/TPCBillDialog/TPCBillDialog"),
  { ssr: false }
);

function TransferDataManagementPage() {
  const [open, setOpen] = useState(false);
  const {
    data: transferDocumentsData,
    loading,
    refetch,
  } = useTransferDocuments();

  const { data: monthlyTpcTransferDegreeData, loading: tpcBillLoading } =
    useMonthlyTransferDegrees();

  return (
    <>
      <Head>
        <title>轉供資料管理</title>
        <meta name="description" content="轉供資料管理" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "轉供資料管理",
            icon: ChartIcon,
            href: "/transfer",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
          <Card sx={{ p: "36px" }}>
            {tpcBillLoading ? (
              <CircularProgress size="24px" />
            ) : (
              <TransferDegreeChart
                name="每月轉供度數"
                data={
                  monthlyTpcTransferDegreeData?.dashboard.tpcBillInfo
                    .monthlyTPCBillTransferDegrees
                }
              />
            )}

            {/* 轉供資料管理表格 */}
          </Card>
          <Divider sx={{ my: "24px" }} />
          {/* 轉供申請進度表格 */}
          <Card sx={{ p: "36px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "16px",
              }}
            >
              <InputSearch />
              <Button onClick={() => setOpen(true)}>新增台電代輸繳費單</Button>
            </Box>
            {/* 轉供申請進度表格 */}
            <TransferDocumentPanel
              transferDocuments={transferDocumentsData?.transferDocuments}
              loading={loading}
              refetchFn={(page) =>
                refetch({
                  limit: page.rows,
                  offset: page.rows * page.index,
                })
              }
            />
          </Card>
        </AuthGuard>
      </Box>
      {open ? (
        <TPCBillDialog
          isOpenDialog={open}
          onClose={() => setOpen(false)}
          variant="create"
        />
      ) : null}
    </>
  );
}

TransferDataManagementPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TransferDataManagementPage;
