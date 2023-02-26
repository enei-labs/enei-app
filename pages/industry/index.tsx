import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { Card, Divider } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useState } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import AddCompanyBtn from "@components/Company/AddCompanyBtn";
import { AuthGuard } from "@components/AuthGuard";
import { Company, Role } from "@core/graphql/types";
import CompanyPanel from "@components/Company/CompanyPanel";
import dynamic from "next/dynamic";

const CompanyContractPanel = dynamic(
  () => import("@components/CompanyContract/CompanyContractPanel")
);

function IndustryPage() {
  const [company, setCompany] = useState<Company | null>(null);
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
            <CompanyPanel
              setCompanyFn={(company: Company) => setCompany(company)}
            />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
        {company ? <CompanyContractPanel company={company} /> : null}
      </Box>
    </>
  );
}

IndustryPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default IndustryPage;
