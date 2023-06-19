import Box from "@mui/material/Box";
import IconBreadcrumbs from "@components/BreadCrumbs";
import {
  Button,
  Card,
  CircularProgress,
  Divider,
  Typography,
} from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import dynamic from "next/dynamic";
import UserBillDialog from "@components/UserBill/UserBillDialog/UserBillDialog";
const TransferDocumentDialog = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/TransferDocumentDialog"
    )
);

const CompanyContractPanel = dynamic(
  () => import("@components/CompanyContract/CompanyContractPanel"),
  {
    loading: () => <CircularProgress size="24px" />,
  }
);

function ExportElectricBillPage() {
  const [open, setOpen] = useState(false);
  const [showUserBillDialog, setShowUserBillDialog] = useState(false);
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
            icon: ChartIcon,
            href: "/user-bill",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
          <Card sx={{ p: "36px" }}>
            <Typography variant="h4">用戶電費單</Typography>

            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "16px",
              }}
            >
              {/* 搜尋 */}
              <InputSearch onChange={() => {}} />

              {/* 新增電費單 */}
              <Button
                startIcon={<AddIcon />}
                onClick={() => setShowUserBillDialog(true)}
              >
                新增電費單組合
              </Button>
            </Box>

            {/* 電費單表格 */}
            {/* <UserPanel
              users={userData?.users}
              loading={loading}
              refetchFn={refetch}
              onAction={onAction}
            /> */}
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
      {showUserBillDialog ? (
        <UserBillDialog
          isOpenDialog={showUserBillDialog}
          variant="create"
          onClose={() => setShowUserBillDialog(false)}
        />
      ) : null}
    </>
  );
}

ExportElectricBillPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default ExportElectricBillPage;
