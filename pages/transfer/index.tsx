import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Tooltip,
} from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import TaskOutlinedIcon from "@mui/icons-material/TaskOutlined";

import dynamic from "next/dynamic";
import { useTransferDocuments } from "@utils/hooks/queries";
import TransferDocumentPanel from "@components/TransferDocument/TransferDocumentPanel";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";
import { useMonthlyTransferDegrees } from "@utils/hooks/queries/useMonthlyTransferDegrees";
import { useSearch } from "@utils/hooks/useSearch";
import InfoIcon from "@mui/icons-material/Info";

const TPCBillDialog = dynamic(
  () => import("@components/TPCBill/TPCBillDialog/TPCBillDialog"),
  { ssr: false }
);

function TransferDataManagementPage() {
  const { setInputValue, searchTerm, executeSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const {
    data: transferDocumentsData,
    loading,
    refetch,
  } = useTransferDocuments({ term: searchTerm });

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
            icon: TaskOutlinedIcon,
            href: "/transfer",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
          <Card sx={{ p: "36px" }}>
              <TransferDegreeChart
                name="每月轉供度數"
                data={
                  monthlyTpcTransferDegreeData?.dashboard.tpcBillInfo
                    .monthlyTPCBillTransferDegrees
                }
                loading={tpcBillLoading}
              />
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
              {/* 搜尋 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <InputSearch onChange={setInputValue} onEnter={executeSearch} />
                <Tooltip title="可使用轉供合約名稱或轉供合約編號搜尋">
                  <InfoIcon />
                </Tooltip>
              </Box>

              {/* 新增台電代輸繳費單 */}
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
