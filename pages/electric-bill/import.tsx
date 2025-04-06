import IconBreadcrumbs from "@components/BreadCrumbs";
import { AuthLayout } from "@components/Layout";
import { ReadExcelInput } from "@components/ReadExcelInput";
import { Card, Typography } from "@mui/material";
import Head from "next/head";
import { ReactElement } from "react";
import ChartIcon from "@mui/icons-material/InsertChartOutlinedSharp";

function UserBillElectricImportPage() {
  return (
    <>
      <Head>
        <title>電費單匯入</title>
        <meta name="description" content="電費單匯入" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "電費單匯出",
            icon: ChartIcon,
            href: "/electric-bill",
          },
          {
            name: "電費單匯入",
            icon: ChartIcon,
            href: "/electric-bill/import",
          },
        ]}
      />
      <Card sx={{ padding: 2, marginTop: "12px" }}>
        <Typography variant="h4" color="#000" mb="12px">
          電費匯入
        </Typography>
        <ReadExcelInput />
      </Card>
    </>
  );
}

UserBillElectricImportPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserBillElectricImportPage;
