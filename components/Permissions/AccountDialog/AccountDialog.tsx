import { CircularProgress, Grid, Typography } from "@mui/material";
import { useEffect, useMemo } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { Account, Role } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import { useCompanies } from "@utils/hooks/queries/useCompanies";
import dynamic from "next/dynamic";
import { useUsers } from "@utils/hooks/queries";
import Dialog from "@components/Dialog";

const EditAccountBtns = dynamic(() => import("./EditAccountBtns"));
const CreateAccountBtn = dynamic(() => import("./CreateAccountBtn"));
import { FormData } from "./FormData";

interface AccountDialogProps {
  isOpenDialog: boolean;
  currentModifyAccount?: Account;
  variant: "edit" | "create";
  closeDialog: VoidFunction;
}

const roleMap = {
  [Role.User]: "使用者",
  [Role.Company]: "發電業",
  [Role.Admin]: "管理員",
  [Role.SuperAdmin]: "超級管理員",
};

const roleOptions = Object.values(Role).map((o) => ({
  label: roleMap[o],
  value: o,
}));

const basicConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "email",
    label: "信箱",
    placeholder: "請填入",
    validated: textValidated,
    value: "test",
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
    options: roleOptions,
  },
];

function AccountDialog(props: AccountDialogProps) {
  const { isOpenDialog, closeDialog, currentModifyAccount, variant } = props;

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
  } = useValidatedForm<FormData>(basicConfigs, {
    defaultValues: currentModifyAccount
      ? {
          email: currentModifyAccount.email,
          name: currentModifyAccount.name,
          role: roleOptions.find((o) => o.value === currentModifyAccount.role),
        }
      : {},
  });
  const role = watch("role");

  const { data: usersData } = useUsers({
    skip: !role || role.value !== Role.User,
  });

  const { data: companiesData, loading } = useCompanies({
    skip: !role || [Role.Admin, Role.SuperAdmin].includes(role.value),
  });

  const displayFieldConfigs: FieldConfig[] = useMemo(() => {
    if ([Role.Admin, Role.SuperAdmin].includes(role?.value))
      return basicConfigs;

    if (role?.value === Role.User) {
      return [
        ...basicConfigs,
        {
          type: "SINGLE_SELECT",
          name: "companyId",
          placeholder: "請填入 (Auto Complete)",
          label: "公司名稱",
          options:
            companiesData?.companies.list.map((o) => ({
              label: o.name,
              value: o.id,
            })) ?? [],
        },
        {
          type: "SINGLE_SELECT",
          name: "userId",
          placeholder: "請填入 (Auto Complete)",
          label: "使用者 email",
          options:
            usersData?.users.list.map((user) => ({
              label: `${user.contactEmail}(${user.name})`,
              value: user.id,
            })) ?? [],
        },
      ];
    }

    return [
      ...basicConfigs,
      {
        type: "SINGLE_SELECT",
        name: "companyId",
        placeholder: "請填入 (Auto Complete)",
        label: "公司名稱",
        options:
          companiesData?.companies.list.map((o) => ({
            label: o.name,
            value: o.id,
          })) ?? [],
      },
    ];
  }, [companiesData, usersData, role]);

  return (
    <Dialog open={isOpenDialog} onClose={closeDialog}>
      {loading ? (
        <CircularProgress size="24px" />
      ) : (
        <>
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
          >
            <Typography variant="h4" textAlign={"left"}>
              {variant === "create" ? "新增帳號" : "修改帳號"}
            </Typography>
            <IconBtn icon={<HighlightOffIcon />} onClick={closeDialog} />
          </Grid>
          <Typography variant="h5" textAlign={"left"}>
            帳號資訊
          </Typography>
          <FieldsController
            configs={displayFieldConfigs}
            form={{ control, errors }}
          />
          <Grid
            container
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={"10px"}
          >
            {!currentModifyAccount ? (
              <CreateAccountBtn
                handleSubmit={handleSubmit}
                closeDialog={closeDialog}
              />
            ) : (
              <EditAccountBtns
                handleSubmit={handleSubmit}
                id={currentModifyAccount.id}
                closeDialog={closeDialog}
              />
            )}
          </Grid>
        </>
      )}
    </Dialog>
  );
}

export default AccountDialog;
