import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { AuthLayout } from "@components/Layout";
import { Box, Button, Card, Divider, Tooltip } from "@mui/material";
import { ReactElement, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import PersonAddAltIcon from "@mui/icons-material/PersonAddAlt";
import { InputSearch } from "@components/Input";
import { AuthGuard } from "@components/AuthGuard";
import { Role, User } from "@core/graphql/types";
import UserPanel from "@components/User/UserPanel";
import { useUsers } from "@utils/hooks/queries";
import { ActionTypeEnum } from "@core/types/actionTypeEnum";
import UserDialog from "@components/User/UserDialog/UserDialog";
import DialogAlert from "@components/DialogAlert";
import { useRemoveUser } from "@utils/hooks";
import { toast } from "react-toastify";
import InfoIcon from "@mui/icons-material/Info";

const UsersPage = () => {
  const [searchTerm, setSearchTerm] = useState<string>("");
  const [term, setTerm] = useState<string>("");
  const search = (value: string) => {
    setTerm(value);
  };
  const {
    data: userData,
    loading,
    refetch,
  } = useUsers({
    variables: { term: term },
  });
  const [actionType, setActionType] = useState<ActionTypeEnum>(
    ActionTypeEnum.CLOSE
  );
  const [currentModifyUser, setCurrentModifyUser] = useState<User>();

  const onAction = (action: ActionTypeEnum, user?: User) => {
    setActionType(action);
    setCurrentModifyUser(user);
  };

  const [removeUser] = useRemoveUser();

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
              <Box sx={{ display: "flex", alignItems: "center", gap: "8px" }}>
                <InputSearch
                  onChange={setSearchTerm}
                  onEnter={() => search(searchTerm)}
                />
                <Tooltip title="可使用用戶名稱或 Email 搜尋">
                  <InfoIcon />
                </Tooltip>
              </Box>

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
              refetchFn={(page) =>
                refetch({
                  limit: page.rows,
                  offset: page.rows * page.index,
                })
              }
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

      <DialogAlert
        open={actionType === ActionTypeEnum.DELETE}
        title={"刪除用戶"}
        content={"是否確認要刪除用戶？"}
        onConfirm={() => {
          if (currentModifyUser) {
            removeUser({
              variables: { input: { userId: currentModifyUser.id } },
              onCompleted: () => {
                toast.success("刪除成功");
                onAction(ActionTypeEnum.CLOSE);
              },
            });
          }
        }}
        onClose={() => onAction(ActionTypeEnum.CLOSE)}
      />
    </>
  );
};

UsersPage.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default UsersPage;
