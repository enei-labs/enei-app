import Box from "@mui/material/Box";
import Toolbar from "@mui/material/Toolbar";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import IconBreadcrumbs from "@components/BreadCrumbs";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import Head from "next/head";

function UserPage() {
  return (
    <>
      <Head>
        <title>用戶管理</title>
        <meta name="description" content="用戶管理" />
      </Head>
      <>
        <Toolbar />
        <IconBreadcrumbs
          items={[
            {
              name: "用戶管理",
              icon: BoltIcon,
              href: "/user",
            },
          ]}
        />
      </>
    </>
  );
}

UserPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserPage;
