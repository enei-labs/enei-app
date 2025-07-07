import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import {
  Button,
  Card,
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
import PageErrorBoundary from "@components/ErrorBoundary/PageErrorBoundary";

import dynamic from "next/dynamic";
import { useTpcBillMonthlyTransferDegrees, useTransferDocuments, useTpcBills } from "@utils/hooks/queries";
import TransferDocumentPanel from "@components/TransferDocument/TransferDocumentPanel";
import TransferDegreeChart from "@components/Dashboard/TransferDegreeChart";
import TPCBillPanel from "@components/TPCBill/TPCBillPanel";
import { useSearch } from "@utils/hooks/useSearch";
import InfoIcon from "@mui/icons-material/Info";

const TPCBillDialog = dynamic(
  () => import("@components/TPCBill/TPCBillDialog/TPCBillDialog"),
  { ssr: false }
);

function TransferDataManagementPage() {
  const { setInputValue, searchTerm, executeSearch } = useSearch();
  const { setInputValue: setTpcSearchInput, searchTerm: tpcSearchTerm, executeSearch: executeTpcSearch } = useSearch();
  const [open, setOpen] = useState(false);
  
  // 轉供申請進度相關
  const {
    data: transferDocumentsData,
    loading,
    refetch,
  } = useTransferDocuments({ term: searchTerm });
  
  // 台電代輸繳費單相關
  const {
    data: tpcBillsData,
    loading: tpcBillsLoading,
    refetch: refetchTpcBills,
  } = useTpcBills();
  
  const [year, setYear] = useState<Date>(new Date());

  const { data: monthlyTpcTransferDegreeData, loading: tpcBillLoading } =
    useTpcBillMonthlyTransferDegrees({
      startedAt: `${year.getFullYear()}-01-01`,
      endedAt: `${year.getFullYear()}-12-31`,
    });

  return (
    <PageErrorBoundary>
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
          {/* 每月轉供度數圖表 */}
          <Card sx={{ p: "36px" }}>
            <TransferDegreeChart
              name="每月轉供度數"
              data={
                monthlyTpcTransferDegreeData?.tpcBillMonthlyTransferDegrees?.monthlyTotals
              }
              loading={tpcBillLoading}
              year={year}
              setYear={setYear}
            />
          </Card>
          
          <Divider sx={{ my: "24px" }} />
          
          {/* 台電代輸繳費單表格 */}
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
                <InputSearch onChange={setTpcSearchInput} onEnter={executeTpcSearch} />
                <Tooltip title="可使用繳費單編號搜尋">
                  <InfoIcon />
                </Tooltip>
              </Box>

              {/* 新增台電代輸繳費單 */}
              <Button onClick={() => setOpen(true)}>新增台電代輸繳費單</Button>
            </Box>
            
            {/* 台電代輸繳費單表格 */}
            <TPCBillPanel
              tpcBillPage={tpcBillsData?.tpcBills}
              loading={tpcBillsLoading}
              refetchFn={(page) =>
                refetchTpcBills({
                  limit: page.rows,
                  offset: page.rows * page.index,
                })
              }
            />
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
          onClose={() => {
            setOpen(false);
            refetchTpcBills({ limit: 10, offset: 0 });
          }}
          variant="create"
        />
      ) : null}
    </PageErrorBoundary>
  );
}

TransferDataManagementPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TransferDataManagementPage;
