import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
// import { useIndustryBillConfig } from "@utils/hooks/queries";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function IndustryBillConfigPage() {
  const router = useRouter();
  const industryBillConfigId = router.query.industryBillConfigId as string;

  // const { data, loading } = useIndustryBill(industryBillId);
  const { data, loading } = {
    data: {
      industryBillConfig: {
        id: industryBillConfigId,
        name: "測試電費單",
      },
    },
    loading: false,
  };

  if (loading) return <CircularProgress size="24px" />;

  return (
    <>
      <Head>
        <title>綠電用戶</title>
        <meta name="description" content="綠電用戶" />
      </Head>
      {data ? (
        <>
          <IconBreadcrumbs
            items={[
              {
                name: "電費單匯出",
                icon: InboxOutlinedIcon,
                href: "/electric-bill",
              },
              {
                name: data.industryBillConfig.name,
                icon: Person2OutlinedIcon,
                href: `/electric-bill/industry-bill-config/${data.industryBillConfig.id}`,
              },
            ]}
          />
          <Box sx={{ paddingTop: "12px" }}></Box>
        </>
      ) : null}
    </>
  );
}

IndustryBillConfigPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default IndustryBillConfigPage;
