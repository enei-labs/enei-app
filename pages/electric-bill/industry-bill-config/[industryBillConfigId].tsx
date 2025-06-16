import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import IndustryBillPanel from "@components/IndustryBill/IndustryBillPanel";
import { useParams } from "next/navigation";

function IndustryBillConfigPage() {
  const params = useParams();
  const router = useRouter();
  const industryBillConfigId = params.industryBillConfigId as string;
  const industryBillConfigName = router.query.industryBillConfigName as string;

  return (
    <>
      <Head>
        <title>綠電用戶</title>
        <meta name="description" content="綠電用戶" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "電費單匯出",
            icon: InboxOutlinedIcon,
            href: "/electric-bill",
          },
          {
            name: industryBillConfigName,
            icon: Person2OutlinedIcon,
            href: `/electric-bill/industry-bill-config/${industryBillConfigId}`,
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <IndustryBillPanel 
          industryBillConfigId={industryBillConfigId} 
          industryBillConfigName={industryBillConfigName} 
        />
      </Box>
    </>
  );
}

IndustryBillConfigPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default IndustryBillConfigPage;
