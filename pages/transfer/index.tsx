import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { Card, CircularProgress, Divider } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import AddCompanyBtn from "@components/Company/AddCompanyBtn";
import { AuthGuard } from "@components/AuthGuard";
import { Company, Role } from "@core/graphql/types";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";

import dynamic from "next/dynamic";

const CompanyContractPanel = dynamic(
  () => import("@components/CompanyContract/CompanyContractPanel"),
  {
    loading: () => <CircularProgress size="24px" />,
  }
);

function TransferPage() {
  return (
    <>
      <Head>
        <title>轉供申請進度</title>
        <meta name="description" content="轉供申請進度" />
      </Head>
      <Toolbar />
      <IconBreadcrumbs
        items={[
          {
            name: "轉供申請進度",
            icon: ChartIcon,
            href: "/transfer",
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
              <InputSearch />
              <AddCompanyBtn />
            </Box>
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>
    </>
  );
}

TransferPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TransferPage;
