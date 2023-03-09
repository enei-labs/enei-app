import { Dispatch } from "react";
import { Table } from "@components/Table";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import DeleteOutlined from "@mui/icons-material/DeleteOutlined";
import NearMeOutlinedIcon from "@mui/icons-material/NearMeOutlined";
import { IconBtn } from "@components/Button";
import { Config, Page } from "@components/Table/Table";
import { Account, AccountPage, Role } from "@core/graphql/types";
import { useAuth } from "@core/context/auth";
import { useRemoveAccount } from "@utils/hooks";
import { useSendResetPasswordEmail } from "@utils/hooks/mutations/useSendResetPasswordEmail";
import { toast } from "react-toastify";
import dynamic from "next/dynamic";
import { CircularProgress } from "@mui/material";
import { Action, State } from "@core/context/account-dialog/reducer";

const AccountDialog = dynamic(
  () => import("@components/Permissions/AccountDialog/AccountDialog"),
  { ssr: false, loading: () => <CircularProgress size="24px" /> }
);
const DialogAlert = dynamic(() => import("@components/DialogAlert"));

const PermissionsPanel = (props: {
  state: State;
  dispatch: Dispatch<Action>;
  accounts?: AccountPage;
  loading?: boolean;
  refetchFn: (page: Page) => void;
}) => {
  const { state, dispatch, accounts, loading = false, refetchFn } = props;
  const { me } = useAuth();

  const [removeAccount] = useRemoveAccount();
  const [sendResetPasswordEmail] = useSendResetPasswordEmail();

  /** 刪除帳號點擊行為 */
  const onDeleteClick = (rowData: Account) => {
    dispatch({ type: "delete", payload: rowData });
  };

  /** 寄送信件點擊行為 */
  const onSendPasswordClick = async (rowData: Account) => {
    await sendResetPasswordEmail({
      variables: { id: rowData.id },
      onCompleted: () => toast.success("寄送成功！"),
    });
  };

  const onDeleteAccount = async (id: string) => {
    const { data } = await removeAccount({
      variables: { input: { accountId: id } },
      onCompleted: () => toast.success("寄送成功！"),
    });
  };

  const onModifyClick = (rowData: Account) => {
    dispatch({ type: "edit", payload: rowData });
  };

  const configs: Config<Account>[] = [
    {
      header: "信箱",
      accessor: "email",
    },
    {
      header: "用戶名稱",
      accessor: "name",
    },
    {
      header: "公司名稱",
      accessor: "companyName",
    },
    {
      header: "權限",
      accessor: "role",
    },
    {
      header: "修改 / 刪除",
      render: (data) => (
        <>
          {/* 修改 */}
          <IconBtn
            icon={<BorderColorOutlined />}
            onClick={() => {
              onModifyClick(data);
            }}
          />

          {/* 刪除 */}
          <IconBtn
            disabled={me?.role !== Role.SuperAdmin}
            icon={<DeleteOutlined />}
            onClick={() => {
              onDeleteClick(data);
            }}
          />
        </>
      ),
    },
    {
      header: "發送密碼設定信件",
      render: (data) => (
        <IconBtn
          icon={<NearMeOutlinedIcon />}
          onClick={() => {
            onSendPasswordClick(data);
          }}
        ></IconBtn>
      ),
    },
  ];

  return (
    <>
      <Table
        configs={configs}
        list={accounts?.list}
        total={accounts?.total}
        loading={loading}
        onPageChange={refetchFn}
      />
      {state.status === "create" || state.status === "edit" ? (
        <AccountDialog
          isOpenDialog={
            !!(state.status === "create" || state.status === "edit")
          }
          variant={state.status}
          currentModifyAccount={state.account}
          onClose={() => dispatch({ type: "closed" })}
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
    </>
  );
};

export default PermissionsPanel;
