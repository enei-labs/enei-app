import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import IndustryBillPanel from "@components/IndustryBill/IndustryBillPanel";
import { PageErrorBoundary } from "@components/ErrorBoundary";
function IndustryBillPage() {
  const router = useRouter();
  const month = router.query.month as string;

  return (
    <>
      <Head>
        <title>發電業電費單</title>
        <meta name="description" content="發電業電費單" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "電費單匯出",
            icon: InboxOutlinedIcon,
            href: "/electric-bill",
          },
          {
            name: "發電業電費單",
            icon: Person2OutlinedIcon,
            href: `/electric-bill/industry-bill${month ? `?month=${month}` : ""}`,
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <PageErrorBoundary>
          <IndustryBillPanel month={month} />
        </PageErrorBoundary>
      </Box>
    </>
  );
}

IndustryBillPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default IndustryBillPage;
