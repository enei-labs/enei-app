import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { AuthLayout } from "@components/Layout";
import {
  Box,
  Button,
  Card,
  Container,
  Divider,
  Grid,
  Toolbar,
  Typography,
} from "@mui/material";
import { InputAutocomplete } from "@components/Input";
import { ReactElement, useEffect, useState } from "react";
import Head from "next/head";
import Dialog from "@components/Dialog";
import IconBreadcrumbs from "@components/BreadCrumbs";
import LockOpenOutlinedIcon from "@mui/icons-material/LockOpenOutlined";
import { ActionBtn, IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { CancelOutlined } from "@mui/icons-material";
import { InputSearch } from "@components/Input";
import PermissionsPanel from "@components/Permissions/PermissionsPanel";
import { useAccounts } from "@utils/hooks/queries/useAccounts";
import { AuthGuard } from "@components/AuthGuard";
import { CreateAccountInput, Role } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useCreateAccount, useValidatedForm } from "@utils/hooks";
import { useCompanies } from "@utils/hooks/queries/useCompanies";
import { ACCOUNTS } from "@core/graphql/queries/accounts";

type FormData = {
  name: string;
  company_id: string;
  email: string;
  role: Role;
};

const Permissions = () => {
  const { data } = useCompanies();

  const [isOpenDialog, setIsOpenDialog] = useState<boolean>(false);

  const [defaultValues, setDefaultValues] = useState<FormData | undefined>(
    undefined
  );

  const [createAccount, { loading }] = useCreateAccount();

  const settingsFieldConfigs: FieldConfig[] = [
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
      type: "COMPONENT",
      name: "company_id",
      component: InputAutocomplete,
      placeholder: "請填入 (Auto Complete)",
      label: "公司名稱",
      options: data?.companies.list.map((o) => ({
        label: o.name,
        value: o.id,
      })),
    },
  ];

  const {
    control,
    handleSubmit,
    reset,
    formState: { errors },
  } = useValidatedForm<FormData>(settingsFieldConfigs, {
    defaultValues: defaultValues,
  });

  const onCreateAccount = async (formData: FormData) => {
    console.log(formData);
    const { data } = await createAccount({
      variables: {
        input: {
          name: formData.name,
          email: formData.email,
          companyId: formData.company_id,
          role: formData.role,
        },
      },
      refetchQueries: [ACCOUNTS],
    });

    if (data?.createAccount.name) {
      reset();
      setIsOpenDialog(false);
    }
  };

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
              <InputSearch />
              <Button
                startIcon={<AddIcon />}
                onClick={() => {
                  setIsOpenDialog(true);
                }}
              >
                新增帳號
              </Button>
            </Box>
            <PermissionsPanel />
          </Card>
          <Divider sx={{ my: "24px" }} />
        </AuthGuard>
      </Box>

      {/* 新增帳號彈窗 */}
      <Dialog open={isOpenDialog} onClose={() => setIsOpenDialog(false)}>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {!defaultValues ? "新增帳號" : "修改帳號"}
          </Typography>
          <IconBtn
            icon={<HighlightOffIcon />}
            onClick={() => {
              setIsOpenDialog(false);
            }}
          />
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
          {!defaultValues ? (
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
                onClick={handleSubmit(onSubmit)}
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
                onClick={() => {
                  setIsOpenDialog(false);
                }}
              >
                取消
              </Button>
            </>
          )}
        </Grid>
      </Dialog>
    </>
  );
};

Permissions.getLayout = (page: ReactElement) => {
  return <AuthLayout>{page}</AuthLayout>;
};

export default Permissions;
