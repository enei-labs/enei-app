import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { AuthLayout } from "@components/Layout";
import {
  Alert,
  Box,
  Button,
  Card,
  CircularProgress,
  Divider,
  Snackbar,
  Toolbar,
} from "@mui/material";
import { ReactElement, useCallback, useReducer, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { InputSearch } from "@components/Input";
import PermissionsPanel from "@components/Permissions/PermissionsPanel";
import { useAccounts } from "@utils/hooks/queries/useAccounts";
import { AuthGuard } from "@components/AuthGuard";
import { Account, AccountPage, Role } from "@core/graphql/types";
import { useRemoveAccount } from "@utils/hooks";
import { useSendResetPasswordEmail } from "@utils/hooks/mutations/useSendResetPasswordEmail";
import dynamic from "next/dynamic";
import { reducer } from "../../core/context/account-dialog/reducer";

const AccountDialog = dynamic(
  () => import("@components/Permissions/AccountDialog/AccountDialog"),
  { ssr: false, loading: () => <CircularProgress size="24px" /> }
);
const DialogAlert = dynamic(() => import("@components/DialogAlert"));

const Permissions = () => {
  const [state, dispatch] = useReducer(reducer, { status: "closed" });

  const [alertType, setAlertType] = useState<
    "delete" | "sendEmail" | undefined
  >(undefined);

  const { data: accountsData } = useAccounts();

  const [removeAccount] = useRemoveAccount();

  const [sendResetPasswordEmail] = useSendResetPasswordEmail();

  /** 刪除帳號點擊行為 */
  const onDeleteClick = (rowData: Account) => {
    dispatch({ type: "delete", payload: rowData });
  };

  /** 寄送信件點擊行為 */
  const onSendPasswordClick = async (rowData: Account) => {
    const { data } = await sendResetPasswordEmail({
      variables: { id: rowData.id },
    });

    if (data) {
      setAlertType("sendEmail");
    }
  };

  const onDeleteAccount = async (id: string) => {
    const { data } = await removeAccount({ variables: { id: id } });

    if (data) {
      setAlertType("delete");
    }
  };

  const onModifyClick = (rowData: Account) => {
    dispatch({ type: "edit", payload: rowData });
  };

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
              accounts={accountsData?.accounts}
              onModifyClick={onModifyClick}
              onDeleteClick={onDeleteClick}
              onSendPasswordClick={onSendPasswordClick}
            />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>

      {state.status === "create" || state.status === "edit" ? (
        <AccountDialog
          isOpenDialog={
            !!(state.status === "create" || state.status === "edit")
          }
          variant={state.status}
          currentModifyAccount={state.account}
          closeDialog={() => dispatch({ type: "closed" })}
        />
      ) : null}

      {/* 刪除帳號彈窗 */}
      {state.status === "delete" ? (
        <DialogAlert
          open={state.status === "delete"}
          title={"刪除用戶"}
          content={"是否確認要刪除用戶？"}
          onConfirm={() => {
            if (!state.account) return;
            onDeleteAccount(state.account.id);
          }}
          onClose={() => dispatch({ type: "closed" })}
        />
      ) : null}

      {/* 修改成功 Toast */}
      <Snackbar
        open={alertType !== undefined}
        autoHideDuration={6000}
        onClose={() => {
          setAlertType(undefined);
        }}
        anchorOrigin={{ horizontal: "center", vertical: "bottom" }}
      >
        <Alert
          onClose={() => {
            setAlertType(undefined);
          }}
          severity="success"
          sx={{ width: "100%" }}
        >
          {alertType === "delete" ? "刪除成功！" : "寄送成功！"}
        </Alert>
      </Snackbar>
    </>
  );
};

Permissions.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Permissions;
