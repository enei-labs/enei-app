import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { AuthLayout } from "@components/Layout";
import { Box, Button, Card, Divider, Toolbar } from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { InputSearch } from "@components/Input";
import { AuthGuard } from "@components/AuthGuard";
import { Role, User } from "@core/graphql/types";
import UserPanel from "@components/User/UserPanel";
import { useUsers } from "@utils/hooks/queries";
import dynamic from "next/dynamic";
import { ActionTypeEnum } from "@core/types/actionTypeEnum";

const UserDialog = dynamic(
  () => import("@components/User/UserDialog/UserDialog")
);

const UsersPage = () => {
  const { data: userData, loading, refetch } = useUsers();
  const [actionType, setActionType] = useState<ActionTypeEnum>(
    ActionTypeEnum.CLOSE
  );
  const [currentModifyUser, setCurrentModifyUser] = useState<User>();

  const onAction = (action: ActionTypeEnum, user?: User) => {
    setActionType(action);
    setCurrentModifyUser(user);
  };

  return (
    <>
      <Head>
        <title>用戶管理</title>
        <meta name="description" content="用戶管理" />
      </Head>
      <IconBreadcrumbs
        items={[
          {
            name: "用戶管理",
            icon: PersonAddAltIcon,
            href: "/user",
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
                onClick={() => onAction(ActionTypeEnum.CREATE)}
              >
                新增用戶
              </Button>
            </Box>

            {/* 帳號表格 */}
            <UserPanel
              users={userData?.users}
              loading={loading}
              refetchFn={refetch}
              onAction={onAction}
            />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>

      {actionType === ActionTypeEnum.EDIT ||
      actionType === ActionTypeEnum.CREATE ? (
        <UserDialog
          isOpenDialog={
            !!(
              actionType === ActionTypeEnum.EDIT ||
              actionType === ActionTypeEnum.CREATE
            )
          }
          variant={actionType}
          onClose={() => onAction(ActionTypeEnum.CLOSE)}
          currentModifyUser={currentModifyUser}
        />
      ) : null}
    </>
  );
};

UsersPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UsersPage;
