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
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";

import dynamic from "next/dynamic";
import { useTransferDocuments } from "@utils/hooks/queries";
import { useSearch } from "@utils/hooks/useSearch";
import InfoIcon from "@mui/icons-material/Info";

const TransferDocumentDialog = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/TransferDocumentDialog"
    )
);

const TransferDocumentPanel = dynamic(
  () => import("@components/TransferDocument/TransferDocumentPanel"),
  {
    loading: () => <CircularProgress size="24px" />,
  }
);

function TransferApplicationProgressPage() {
  const { searchTerm, setInputValue, executeSearch } = useSearch();
  const [open, setOpen] = useState(false);
  const {
    data: transferDocumentsData,
    loading,
    refetch,
  } = useTransferDocuments({
    term: searchTerm,
  });

  return (
    <>
      <Head>
        <title>轉供申請進度</title>
        <meta name="description" content="轉供申請進度" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "轉供申請進度",
            icon: ChartIcon,
            href: "/application",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
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
              {/* 新增轉供合約 */}
              <Button onClick={() => setOpen(true)}>新增轉供合約</Button>
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
        <TransferDocumentDialog
          isOpenDialog={open}
          onClose={() => setOpen(false)}
          variant="create"
        />
      ) : null}
    </>
  );
}

TransferApplicationProgressPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TransferApplicationProgressPage;
