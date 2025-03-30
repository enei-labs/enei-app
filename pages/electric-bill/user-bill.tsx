import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import { Box } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import InboxOutlinedIcon from "@mui/icons-material/InboxOutlined";
import UserBillPanel from "@components/UserBill/UserBillPanel";
function UserBillPage() {
  const router = useRouter();
  const month = router.query.month as string;

  console.log({ month });

  return (
    <>
      <Head>
        <title>用戶電費單</title>
        <meta name="description" content="用戶電費單" />
      </Head>
      {month ? (
        <>
          <IconBreadcrumbs
            items={[
              {
                name: "電費單匯出",
                icon: InboxOutlinedIcon,
                href: "/electric-bill",
              },
              {
                name: "用戶電費單",
                icon: Person2OutlinedIcon,
                href: `/electric-bill/user-bill?month=${month}`,
              },
            ]}
          />
          <Box sx={{ paddingTop: "12px" }}>
            <UserBillPanel month={month} />
          </Box>
        </>
      ) : null}
    </>
  );
}

UserBillPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserBillPage;
