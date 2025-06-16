import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import UserBillPanel from "@components/UserBill/UserBillPanel";
import { useParams } from "next/navigation";

function UserBillConfigPage() {
  const params = useParams();
  const router = useRouter();
  const userBillConfigId = params.userBillConfigId as string;
  const userBillConfigName = router.query.userBillConfigName as string;

  return (
    <>
      <Head>
        <title>用戶電費單組合</title>
        <meta name="description" content="用戶電費單組合" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "電費單匯出",
            icon: InboxOutlinedIcon,
            href: "/electric-bill",
          },
          {
            name: userBillConfigName,
            icon: Person2OutlinedIcon,
            href: `/electric-bill/user-bill-config/${userBillConfigId}`,
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <UserBillPanel 
          userBillConfigId={userBillConfigId} 
          userBillConfigName={userBillConfigName} 
        />
      </Box>
    </>
  );
}

UserBillConfigPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserBillConfigPage;
