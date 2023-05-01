import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { Card, CircularProgress, Divider } from "@mui/material";
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
const TransferDocumentDialog = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/TransferDocumentDialog"
    )
);

function TransferDataManagementPage() {
  const [open, setOpen] = useState(false);
  const { data: transferDocumentsData, loading } = useTransferDocuments();
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
            <DemoChart name="每月轉供度數" />

            {/* 轉供資料管理表格 */}
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
    </>
  );
}

TransferDataManagementPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TransferDataManagementPage;
