import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { AuthLayout } from "@components/Layout";
import { Box, Button, Card, Divider, Toolbar } from "@mui/material";
import { ReactElement, useReducer } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { InputSearch } from "@components/Input";
import PermissionsPanel from "@components/Permissions/PermissionsPanel";
import { useAccounts } from "@utils/hooks/queries/useAccounts";
import { AuthGuard } from "@components/AuthGuard";
import { Role } from "@core/graphql/types";
import { reducer } from "@core/context/account-dialog/reducer";

const Permissions = () => {
  const { data: accountsData, loading } = useAccounts();
  const [state, dispatch] = useReducer(reducer, { status: "closed" });

  // /** 搜尋行為 */
  // const onSearch = (value: string) => {
  //   if (!accountsData) return;

  //   if (!value) setFilterData(accountsData.accounts);

  //   const _filterList = accountsData.accounts.list.filter((o) =>
  //     o.name.includes(value)
  //   );

  //   const _filterData: AccountPage = {
  //     list: _filterList,
  //     total: _filterList.length,
  //     __typename: accountsData.accounts.__typename,
  //   };

  //   setFilterData(_filterData);
  // };

  // useEffect(() => {
  //   if (accountsData) setFilterData(accountsData.accounts);
  // }, [accountsData, data?.companies.list]);

  return (
    <>
      <Head>
        <title>權限管理</title>
        <meta name="description" content="權限管理" />
      </Head>
      <Toolbar></Toolbar>
      <IconBreadcrumbs
        items={[
          {
            name: "權限管理",
            icon: LockOpenOutlinedIcon,
            href: "/permissions",
          },
        ]}
      />
      <Box sx={{ paddingTop: "12px" }}>
        <AuthGuard roles={[Role.Admin, Role.SuperAdmin]}>
          <Card sx={{ p: "36px" }}>
            <Box
              sx={{
                display: "flex",
                justifyContent: "space-between",
                mb: "16px",
              }}
            >
              {/* 搜尋 */}
              <InputSearch onChange={() => {}} />

              {/* 新增帳號 */}
              <Button
                startIcon={<AddIcon />}
                onClick={() => dispatch({ type: "create" })}
              >
                新增帳號
              </Button>
            </Box>

            {/* 帳號表格 */}
            <PermissionsPanel
              state={state}
              dispatch={dispatch}
              loading={loading}
              accounts={accountsData?.accounts}
            />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>
    </>
  );
};

Permissions.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Permissions;
