import { CircularProgress, Grid, Typography } from "@mui/material";
import { useCallback, useEffect, useMemo } from "react";
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
import HelperText from "@components/HelperText";

interface AccountDialogProps {
  isOpenDialog: boolean;
  currentModifyAccount?: Account;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const roleMap = {
  [Role.User]: "綠電用戶",
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
    type: "SINGLE_SELECT",
    name: "role",
    placeholder: "請選擇",
    label: "權限",
    options: roleOptions,
  },
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
];

function AccountDialog(props: AccountDialogProps) {
  const { isOpenDialog, onClose, currentModifyAccount, variant } = props;

  const {
    control,
    formState: { errors },
    watch,
    handleSubmit,
    setValue,
  } = useValidatedForm<FormData>(basicConfigs, {
    defaultValues: currentModifyAccount
      ? {
          email: currentModifyAccount.email,
          name: currentModifyAccount.name,
          role: roleOptions.find((o) => o.value === currentModifyAccount.role),
          companyId: currentModifyAccount.company
            ? {
                label: currentModifyAccount.company.name,
                value: currentModifyAccount.company.id,
              }
            : undefined,
          userId: currentModifyAccount.user
            ? {
                label: `${currentModifyAccount.user.contactEmail}(${currentModifyAccount.user.name})`,
                value: currentModifyAccount.user.id,
              }
            : undefined,
        }
      : {},
  });
  const role = watch("role");
  const company = watch("companyId");
  const user = watch("userId");

  const {
    data: usersData,
    fetchMore: usersFetchMore,
    loading: usersLoading,
  } = useUsers({
    onlyBasicInformation: true,
    skip: !role || role.value !== Role.User,
  });

  const {
    data: companiesData,
    loading: companiesLoading,
    fetchMore: companiesFetchMore,
  } = useCompanies({
    skip: !role || [Role.Admin, Role.SuperAdmin].includes(role.value),
  });

  const companiesLoadMore = useCallback(
    () =>
      companiesFetchMore({
        variables: {
          offset: companiesData?.companies.list.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            companies: {
              total: fetchMoreResult.companies.total,
              list: [
                ...(prev?.companies?.list ?? []),
                ...fetchMoreResult.companies.list,
              ],
            },
          };
        },
      }),
    [companiesData, companiesFetchMore]
  );

  const usersLoadMore = useCallback(
    () =>
      usersFetchMore({
        variables: {
          onlyBasicInformation: true,
          offset: usersData?.users.list.length,
        },
        updateQuery: (prev, { fetchMoreResult }) => {
          if (!fetchMoreResult) return prev;
          return {
            users: {
              total: fetchMoreResult.users.total,
              list: [
                ...(prev?.users?.list ?? []),
                ...fetchMoreResult.users.list,
              ],
            },
          };
        },
      }),
    [usersData, usersFetchMore]
  );

  const displayFieldConfigs: FieldConfig[] = useMemo(() => {
    if ([Role.Admin, Role.SuperAdmin].includes(role?.value))
      return basicConfigs;

    if (role?.value === Role.User) {
      const userConfigs = [
        basicConfigs[0],
        {
          type: "SINGLE_SELECT",
          name: "userId",
          placeholder: "請填入 (Auto Complete)",
          label: "綠電用戶",
          options:
            usersData?.users.list.map((user) => ({
              label: `${user.contactEmail}(${user.name})`,
              value: user.id,
            })) ?? [],
          fetchMoreData: usersLoadMore,
        } as FieldConfig,
        basicConfigs[1],
        basicConfigs[2],
      ];
      return userConfigs;
    }

    return [
      basicConfigs[0],
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
        helperText: "若查無此公司，需先至發電業頁面新增公司",
        fetchMoreData: companiesLoadMore,
      } as FieldConfig,
      basicConfigs[1],
      basicConfigs[2],
    ];
  }, [companiesData, usersData, role, companiesLoadMore, usersLoadMore]);

  useEffect(() => {
    if (usersLoading || companiesLoading) return;

    if (role?.value === Role.Company && company?.value && companiesData) {
      const companyData = companiesData?.companies.list.find(
        (o) => o.id === company.value
      );
      if (currentModifyAccount?.email !== companyData?.contactEmail) {
        setValue("email", companyData?.contactEmail ?? "");
      }
      if (currentModifyAccount?.name !== companyData?.contactName) {
        setValue("name", companyData?.contactName ?? "");
      }
    }

    if (role?.value === Role.User && user?.value && usersData) {
      const userData = usersData?.users.list.find((o) => o.id === user.value);
      if (currentModifyAccount?.email !== userData?.contactEmail) {
        setValue("email", userData?.contactEmail ?? "");
      }
      if (currentModifyAccount?.name !== userData?.contactName) {
        setValue("name", userData?.contactName ?? "");
      }
    }
  }, [
    role,
    company,
    user,
    usersData,
    companiesData,
    setValue,
    currentModifyAccount,
    usersLoading,
    companiesLoading,
  ]);

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      {companiesLoading || usersLoading ? (
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
            <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
          </Grid>
          <Typography variant="h5" textAlign={"left"}>
            帳號資訊
          </Typography>
          <FieldsController
            configs={displayFieldConfigs}
            form={{ control, errors }}
          />
          <HelperText>
            <ul style={{ textAlign: "left" }}>
              <li>
                若查無此公司，請先前往『發電業管理』或『用戶管理』頁面新增公司
              </li>
              <li>
                在權限管理面板中，需點擊『發送密碼設定信件』按鈕，用戶將會收到一封包含重設帳戶密碼連結的信件。用戶需要透過該連結來重設他們的帳戶密碼，並在完成重設後方能繼續使用該帳戶
              </li>
            </ul>
          </HelperText>
          <Grid
            container
            justifyContent={"flex-start"}
            alignItems={"center"}
            gap={"10px"}
          >
            {!currentModifyAccount ? (
              <CreateAccountBtn handleSubmit={handleSubmit} onClose={onClose} />
            ) : (
              <EditAccountBtns
                handleSubmit={handleSubmit}
                id={currentModifyAccount.id}
                onClose={onClose}
              />
            )}
          </Grid>
        </>
      )}
    </Dialog>
  );
}

export default AccountDialog;
