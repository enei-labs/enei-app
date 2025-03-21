import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import { useUserBills } from "@utils/hooks/queries";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";

function UserBillConfigPage() {
  const router = useRouter();
  const userBillConfigId = router.query.userBillConfigId as string;

  // const { data, loading } = useIndustryBill(industryBillId);
  const { data, loading } = {
    data: {
      userBillConfig: {
        id: userBillConfigId,
        name: "測試電費單",
      },
    },
    loading: false,
  };

  if (loading) return <CircularProgress size="24px" />;

  return (
    <>
      <Head>
        <title>用戶電費單</title>
        <meta name="description" content="用戶電費單" />
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
                name: data.userBillConfig.name,
                icon: Person2OutlinedIcon,
                href: `/electric-bill/user-bill-config/${data.userBillConfig.id}`,
              },
            ]}
          />
          <Box sx={{ paddingTop: "12px" }}></Box>
        </>
      ) : null}
    </>
  );
}

UserBillConfigPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserBillConfigPage;
