import Box from "@mui/material/Box";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { Card, CircularProgress, Divider, Tooltip } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import { InputSearch } from "@components/Input";
import AddCompanyBtn from "@components/Company/AddCompanyBtn";
import { AuthGuard } from "@components/AuthGuard";
import { Company, Role } from "@core/graphql/types";
import CompanyPanel from "@components/Company/CompanyPanel";
import dynamic from "next/dynamic";
import { useSearch } from "@utils/hooks/useSearch";
import InfoIcon from "@mui/icons-material/Info";
import PageErrorBoundary from "@components/ErrorBoundary/PageErrorBoundary";

const CompanyContractPanel = dynamic(
  () => import("@components/CompanyContract/CompanyContractPanel"),
  {
    loading: () => <CircularProgress size="24px" />,
  }
);

function IndustryPage() {
  const { setInputValue, searchTerm, executeSearch } = useSearch();
  const [company, setCompany] = useState<Company | null>(null);

  useEffect(() => {
    const element = document.getElementById("company-contract-panel");
    if (company && element) {
      window.scrollTo({
        top: element.offsetTop,
        behavior: "smooth",
      });
    }
  }, [company]);

  return (
    <PageErrorBoundary>
      <Head>
        <title>發電業管理</title>
        <meta name="description" content="發電業管理" />
      </Head>
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
              {/* 搜尋 */}
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <InputSearch onChange={setInputValue} onEnter={executeSearch} />
                <Tooltip title="可使用公司名稱或統一編號搜尋">
                  <InfoIcon />
                </Tooltip>
              </Box>

              {/* 新增發電業 */}
              <AddCompanyBtn />
            </Box>
            <CompanyPanel
              searchTerm={searchTerm}
              setCompanyFn={(company: Company) => setCompany(company)}
            />
          </Card>
          {company ? <Divider sx={{ my: "24px" }} /> : null}
        </AuthGuard>
        <Box id="company-contract-panel">
          {company ? <CompanyContractPanel company={company} /> : null}
        </Box>
      </Box>
    </PageErrorBoundary>
  );
}

IndustryPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default IndustryPage;
