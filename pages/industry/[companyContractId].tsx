import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import { useRouter } from "next/router";
import { useCompanyContract } from "@utils/hooks/queries/useCompanyContract";
import DescriptionOutlinedIcon from "@mui/icons-material/DescriptionOutlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";

function CompanyContractPage() {
  const router = useRouter();
  const { companyContractId } = router.query;
  const { data, loading } = useCompanyContract(companyContractId as string);

  if (loading) return <CircularProgress size="24px" />;

  return (
    <>
      <Head>
        <title>合約</title>
        <meta name="description" content="合約" />
      </Head>
      {data ? (
        <>
          <IconBreadcrumbs
            items={[
              {
                name: "發電業管理",
                icon: BoltIcon,
                href: "/industry",
              },
              {
                name: data.companyContract.name,
                icon: DescriptionOutlinedIcon,
                href: `/industry/${data.companyContract.id}`,
              },
            ]}
          />
          <Box sx={{ paddingTop: "12px" }}>123</Box>
        </>
      ) : null}
    </>
  );
}

export default CompanyContractPage;
