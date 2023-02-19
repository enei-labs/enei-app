import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IconBreadcrumbs from "@components/BreadCrumbs";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { Button, Card, Divider, Grid, Typography } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { InputSearch, InputText } from "@components/Input";
import ContractBox from "@components/ContractBox";
import { BasicSelect } from "@components/Select";
import AddCompanyBtn from "@components/Company/AddCompanyBtn";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import CompanyPanel from "@components/Company/CompanyPanel";
import AddCompanyContractBtn from "@components/CompanyContract/AddCompanyContractBtn";

function IndustryPage() {
  const [state, setState] = useState("");
  return (
    <>
      <Head>
        <title>發電業管理</title>
        <meta name="description" content="發電業管理" />
      </Head>
      <Toolbar />
      <IconBreadcrumbs
        items={[
          {
            name: "發電業管理",
            icon: BoltIcon,
            href: "/industry",
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
            <CompanyPanel />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
        <Card sx={{ p: "36px" }}>
          <Typography variant="h4">再生能源股份有限公司2</Typography>
          <Box
            sx={{
              display: "flex",
              justifyContent: "space-between",
              mt: "24px",
            }}
          >
            <Box sx={{ display: "flex", columnGap: "0.75em" }}>
              <InputSearch />
              <BasicSelect state={state} setState={setState} items={[]} />
            </Box>
            <AddCompanyContractBtn />
          </Box>
          <Grid container spacing={2} sx={{ mt: "24px" }}>
            <Grid item sm={4}>
              <ContractBox
                title="XXX-XXXX-XX（合約名稱）"
                subtitle="3,000MWh"
              />
            </Grid>
            <Grid item sm={4}>
              <ContractBox
                title="XXX-XXXX-XX（合約名稱）"
                subtitle="3,000MWh"
              />
            </Grid>
            <Grid item sm={4}>
              <ContractBox
                title="XXX-XXXX-XX（合約名稱）"
                subtitle="3,000MWh"
              />
            </Grid>
            <Grid item sm={4}>
              <ContractBox
                title="XXX-XXXX-XX（合約名稱）"
                subtitle="3,000MWh"
              />
            </Grid>
          </Grid>
        </Card>
      </Box>
    </>
  );
}

IndustryPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default IndustryPage;
