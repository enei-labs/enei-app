import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CircularProgress from "@mui/material/CircularProgress";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import { useTransferDocument } from "@utils/hooks/queries";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";
import TransferDocumentCard from "@components/TransferDocument/TransferDocumentCard";

function TransferDocumentPage() {
  const router = useRouter();
  const { transferDocumentId } = router.query;
  const { data, loading } = useTransferDocument(transferDocumentId as string);

  if (loading) return <CircularProgress size="24px" />;

  return (
    <>
      <Head>
        <title>轉供合約</title>
        <meta name="description" content="轉供合約" />
      </Head>
      {data ? (
        <>
          <IconBreadcrumbs
            items={[
              {
                name: "轉供申請進度",
                icon: ChartIcon,
                href: "/application",
              },
              {
                name: data.transferDocument.name,
                icon: Person2OutlinedIcon,
                href: `/application/${data.transferDocument.id}`,
              },
            ]}
          />
          <Box sx={{ paddingTop: "12px" }}>
            <TransferDocumentCard transferDocument={data.transferDocument} />
          </Box>
        </>
      ) : null}
    </>
  );
}

TransferDocumentPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default TransferDocumentPage;
