import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { AuthLayout } from "@components/Layout";
import {
  Alert,
  Box,
  Button,
  Card,
  Divider,
  Grid,
  Snackbar,
  Toolbar,
  Typography,
} from "@mui/material";
import { ReactElement, useCallback, useEffect, useMemo, useState } from "react";
import Head from "next/head";
import IconBreadcrumbs from "@components/BreadCrumbs";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { CancelOutlined } from "@mui/icons-material";
import { InputSearch } from "@components/Input";
import PermissionsPanel from "@components/Permissions/PermissionsPanel";
import { useAccounts } from "@utils/hooks/queries/useAccounts";
import { AuthGuard } from "@components/AuthGuard";
import { Account, AccountPage, Role } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import {
  useCreateAccount,
  useModifyAccount,
  useRemoveAccount,
  useValidatedForm,
} from "@utils/hooks";
import { useCompanies } from "@utils/hooks/queries/useCompanies";
import { ACCOUNTS } from "@core/graphql/queries/accounts";
import { useSendResetPasswordEmail } from "@utils/hooks/mutations/useSendResetPasswordEmail";
import dynamic from "next/dynamic";

export type FormData = {
  name: string;
  email: string;
  role?: {
    label: string;
    value: Role;
  };
  companyId?: {
    label: string;
    value: string;
  };
};

const Dialog = dynamic(() => import("@components/Dialog"));

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

const Permissions = () => {
  const { data } = useCompanies();

  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const [isOpenDeleteDialog, setIsOpenDeleteDialog] = useState<boolean>(false);

  const [alertType, setAlertType] = useState<
    "delete" | "sendEmail" | undefined
  >(undefined);

  const [currentModifyAccount, setCurrentModifyAccount] = useState<
    Account | undefined
  >();

  const { data: accountsData } = useAccounts();

  const [createAccount] = useCreateAccount();

  const [modifyAccount] = useModifyAccount();

  const [removeAccount] = useRemoveAccount();

  const [sendResetPasswordEmail] = useSendResetPasswordEmail();

  const [filterData, setFilterData] = useState<AccountPage | undefined>();

  const settingsFieldConfigs: FieldConfig[] = useMemo(() => {
    const config: FieldConfig[] = [
      {
        type: "TEXT",
        name: "email",
        label: "信箱",
        placeholder: "請填入",
        validated: textValidated,
      },
      {
        type: "TEXT",
        name: "name",
        label: "名稱",
        placeholder: "請填入",
        validated: textValidated,
      },
      {
        type: "SINGLE_SELECT",
        name: "role",
        placeholder: "請選擇",
        label: "權限",
        options: Object.values(Role).map((o) => ({
          label: o,
          value: o,
        })),
      },
      {
        type: "SINGLE_SELECT",
        name: "companyId",
        placeholder: "請填入 (Auto Complete)",
        label: "公司名稱",
        options:
          data?.companies.list.map((o) => ({
            label: o.name,
            value: o.id,
          })) ?? [],
      },
    ];

    return currentModifyAccount &&
      [Role.Admin, Role.SuperAdmin].includes(currentModifyAccount.role)
      ? config.slice(0, 2)
      : config;
  }, [currentModifyAccount, data]);

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
    setValue,
  } = useValidatedForm<FormData>(settingsFieldConfigs);

  const resetDialog = useCallback(() => {
    setIsOpenDialog(false);
    setIsOpenDeleteDialog(false);
    setCurrentModifyAccount(undefined);
    reset({
      name: "",
      email: "",
      role: undefined,
      companyId: undefined,
    });
  }, [reset]);

  /** 新增帳號 query */
  const onCreateAccount = async (formData: FormData) => {
    const { data } = await createAccount({
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          companyId: formData.companyId.value,
          role: formData.role.value,
        },
      },
      refetchQueries: [ACCOUNTS],
    });

    if (data) {
      reset();
      setIsOpenDialog(false);
    }
  };

  /** 修改帳號 query */
  const onModifyAccount = async (formData: FormData) => {
    const { name, email, companyId } = formData;
    const { data } = await modifyAccount({
      variables: {
        name: name,
        email: email,
        companyId: companyId?.value || undefined,
        id: currentModifyAccount?.id,
      },
      refetchQueries: [ACCOUNTS],
    });

    if (data) {
      resetDialog();
    }
  };

  /** 編輯帳號點擊行為 */
  const onModifyClick = (rowData: Account) => {
    if (!data) return;

    const { name, email, companyName, role } = rowData;
    setValue("name", name);
    setValue("email", email);
    setValue("role", { label: role, value: role });

    setCurrentModifyAccount(rowData);
    setIsOpenDialog(true);
  };

  /** 刪除帳號點擊行為 */
  const onDeleteClick = (rowData: Account) => {
    setIsOpenDeleteDialog(true);
    setCurrentModifyAccount(rowData);
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

  /** 搜尋行為 */
  const onSearch = (value: string) => {
    if (!accountsData) return;

    if (!value) setFilterData(accountsData.accounts);

    const _filterList = accountsData.accounts.list.filter((o) =>
      o.name.includes(value)
    );

    const _filterData: AccountPage = {
      list: _filterList,
      total: _filterList.length,
      __typename: accountsData.accounts.__typename,
    };

    setFilterData(_filterData);
  };

  useEffect(() => {
    if (accountsData) setFilterData(accountsData.accounts);
  }, [accountsData, data?.companies.list]);

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
              <InputSearch onChange={onSearch} />

              {/* 新增帳號 */}
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsOpenDialog(true);
                }}
              >
                新增帳號
              </Button>
            </Box>

            {/* 帳號表格 */}
            <PermissionsPanel
              accounts={filterData}
              onModifyClick={onModifyClick}
              onDeleteClick={onDeleteClick}
              onSendPasswordClick={onSendPasswordClick}
            />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>

      {/* 新增帳號彈窗 */}
      <Dialog open={isOpenDialog} onClose={resetDialog}>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {!currentModifyAccount ? "新增帳號" : "修改帳號"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={resetDialog} />
        </Grid>
        <Typography variant="h5" textAlign={"left"}>
          帳號資訊
        </Typography>
        <FieldsController
          configs={settingsFieldConfigs}
          form={{ control, errors }}
        />
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          {!currentModifyAccount ? (
            <Button
              startIcon={<AddIcon />}
              onClick={handleSubmit(onCreateAccount)}
            >
              新增
            </Button>
          ) : (
            <>
              <Button
                startIcon={<SaveOutlinedIcon />}
                onClick={handleSubmit(onModifyAccount)}
              >
                儲存
              </Button>
              <Button
                startIcon={<CancelOutlined />}
                sx={{
                  "&.MuiButton-text": {
                    backgroundColor: "transparent",
                    background: "primary.dark",
                    color: "primary.dark",
                  },
                  ".MuiButton-startIcon": {
                    svg: {
                      color: "primary.dark",
                    },
                  },
                }}
                onClick={resetDialog}
              >
                取消
              </Button>
            </>
          )}
        </Grid>
      </Dialog>

      {/* 刪除帳號彈窗 */}
      <DialogAlert
        open={isOpenDeleteDialog}
        title={"刪除用戶"}
        content={"是否確認要刪除用戶？"}
        onConfirm={() => {
          if (!currentModifyAccount) return;
          onDeleteAccount(currentModifyAccount.id);
        }}
        onClose={resetDialog}
      />

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
