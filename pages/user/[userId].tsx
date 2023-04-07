import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import BoltIcon from "@mui/icons-material/BoltOutlined";
import { useRouter } from "next/router";
import Person2OutlinedIcon from "@mui/icons-material/Person2Outlined";
import CircularProgress from "@mui/material/CircularProgress";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { Box, Toolbar } from "@mui/material";
import { AuthLayout } from "@components/Layout";
import { ReactElement } from "react";
import { useUser } from "@utils/hooks/queries";
import UserCard from "@components/User/UserCard";

function UserPage() {
  const router = useRouter();
  const { userId } = router.query;
  const { data, loading } = useUser(userId as string);

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
                name: "用戶管理",
                icon: PersonAddAltIcon,
                href: "/user",
              },
              {
                name: data.user.name,
                icon: Person2OutlinedIcon,
                href: `/user/${data.user.id}`,
              },
            ]}
          />
          <Box sx={{ paddingTop: "12px" }}>
            <UserCard user={data.user} />
          </Box>
        </>
      ) : null}
    </>
  );
}

UserPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UserPage;
