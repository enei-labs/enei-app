import { Grid, Typography } from "@mui/material";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { UserBillConfig } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useForm } from "react-hook-form";
import { InputText } from "@components/Input";
import RadioGroup from "@components/RadioGroup";
import { UserBillConfigChargeType } from "@core/graphql/types";
import { ElectricNumbersField } from "@components/UserBill/UserBillConfigDialog/ElectricNumbersField";
import { useUsers } from "@utils/hooks/queries";
import { useCallback } from "react";
import UpdateUserBillConfigBtn from "@components/UserBill/UserBillConfigDialog/UpdateUserBillConfigBtn";
import CreateUserBillConfigBtn from "@components/UserBill/UserBillConfigDialog/CreateUserBillConfigBtn";

interface UserBillConfigDialogProps {
  isOpenDialog: boolean;
  currentModifyUserBillConfig?: UserBillConfig;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const ChargeTypeRadios = [
  {
    label: "向用戶收取",
    value: UserBillConfigChargeType.User,
  },
  {
    label: "自行負擔",
    value: UserBillConfigChargeType.Self,
  },
];

const YesOrNoRadios = [
  {
    label: "是",
    value: true,
  },
  {
    label: "不是",
    value: false,
  },
];

function UserBillConfigDialog(props: UserBillConfigDialogProps) {
  const { isOpenDialog, onClose, currentModifyUserBillConfig, variant } = props;

  const { data, loading, fetchMore } = useUsers();

  const usersLoadMore = useCallback(
    () =>
      fetchMore({
        variables: {
          offset: data?.users.list.length,
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
    [data, fetchMore]
  );

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useForm<FormData>({
    defaultValues: currentModifyUserBillConfig
      ? {
          name: currentModifyUserBillConfig.name,
          userId: {
            label: currentModifyUserBillConfig.user.contactEmail,
            value: currentModifyUserBillConfig.user.id,
          },
          recipientAccount: {
            label: `(${currentModifyUserBillConfig.recipientAccount.bankCode}) ${currentModifyUserBillConfig.recipientAccount.account}`,
            value: {
              bankCode: currentModifyUserBillConfig.recipientAccount.bankCode,
              account: currentModifyUserBillConfig.recipientAccount.account,
            },
          },
          estimatedBillDeliverDate:
            currentModifyUserBillConfig.estimatedBillDeliverDate,
          paymentDeadline: currentModifyUserBillConfig.paymentDeadline,
          transportationFee: currentModifyUserBillConfig.transportationFee,
          credentialInspectionFee:
            currentModifyUserBillConfig.credentialInspectionFee,
          credentialServiceFee:
            currentModifyUserBillConfig.credentialServiceFee,
          noticeForTPCBill: currentModifyUserBillConfig.noticeForTPCBill,
          electricNumberInfos: (
            currentModifyUserBillConfig.electricNumbers ?? []
          ).map((number) => ({
            number: {
              label: number,
              value: number,
            },
            price: "",
          })),
          contactName: currentModifyUserBillConfig.contactName,
          contactEmail: currentModifyUserBillConfig.contactEmail,
          contactPhone: currentModifyUserBillConfig.contactPhone,
          address: currentModifyUserBillConfig.address,
        }
      : {},
  });

  const userId = watch("userId");

  const userInformationConfig: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "電費單組合名稱",
      placeholder: "請填入",
      validated: textValidated,
      required: true,
    },
    {
      type: "SINGLE_SELECT",
      name: "userId",
      label: "用戶",
      placeholder: "請填入",
      options:
        data?.users.list.map((user) => ({
          label: `${user.contactEmail}(${user.name})`,
          value: user.id,
        })) ?? [],
      validated: textValidated,
      loading: loading,
      fetchMoreData: usersLoadMore,
      required: true,
    },
    {
      type: "SINGLE_SELECT",
      name: "recipientAccount",
      label: "收款帳戶",
      placeholder: "請填入",
      validated: textValidated,
      options:
        data?.users.list
          .find((user) => userId?.value === user.id)
          ?.bankAccounts.map((b) => ({
            label: `${b.bankCode}(${b.bankName}) ${b.account}`,
            value: {
              bankCode: b.bankCode,
              account: b.account,
            },
          })) ?? [],
      loading: loading,
      required: true,
    },
    {
      type: "NUMBER",
      name: "estimatedBillDeliverDate",
      label: "預計電費單寄出期限（收到繳費通知單後天數）",
      placeholder: "請填入",
      validated: textValidated,
    },
    {
      type: "NUMBER",
      name: "paymentDeadline",
      label: "用戶繳費期限（收到繳費通知單後天數）",
      placeholder: "請填入",
      validated: textValidated,
      required: true,
    },
  ];

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增用戶電費單組合" : "修改用戶電費單組合"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 用戶資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          用戶電費單設定
        </Typography>
        <FieldsController
          configs={userInformationConfig}
          form={{ control, errors }}
        />

        <Controller
          control={control}
          name={"transportationFee"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="代輸費款項"
                radios={ChargeTypeRadios}
                required
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"credentialInspectionFee"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="憑證審查費"
                radios={ChargeTypeRadios}
                required
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"credentialServiceFee"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="憑證服務費"
                radios={ChargeTypeRadios}
                required
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"noticeForTPCBill"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="是否需包含台電代輸費單"
                radios={YesOrNoRadios}
                required
              />
            );
          }}
        />

        {/* 用戶電號 Block */}
        <Typography variant="h5" textAlign={"left"}>
          用戶電號
        </Typography>

        {userId && userId.value ? (
          <Controller
            control={control}
            name={`electricNumberInfos`}
            render={({ field }) => (
              <ElectricNumbersField
                field={field}
                control={control}
                userId={userId.value}
              />
            )}
          />
        ) : null}

        {/* 電費收件人資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          電費收件人資訊
        </Typography>

        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          flexDirection={"row"}
          gap={"16px"}
          flexWrap={"nowrap"}
        >
          <Controller
            control={control}
            name={"contactName"}
            render={({ field }) => (
              <>
                <InputText
                  label={"收件人姓名"}
                  {...field}
                  placeholder={"請填入"}
                  required
                />
              </>
            )}
          ></Controller>
          <Controller
            control={control}
            name={"contactPhone"}
            render={({ field }) => (
              <>
                <InputText
                  label={"收件人電話"}
                  {...field}
                  placeholder={"請填入"}
                  required
                />
              </>
            )}
          ></Controller>
        </Grid>

        <Controller
          control={control}
          name={"contactEmail"}
          render={({ field }) => (
            <>
              <InputText
                label={"收件人信箱"}
                {...field}
                placeholder={"請填入"}
                required
              />
            </>
          )}
        ></Controller>

        <Controller
          control={control}
          name={"address"}
          render={({ field }) => (
            <>
              <InputText
                label={"收件人地址"}
                {...field}
                placeholder={"請填入"}
                required
              />
            </>
          )}
        ></Controller>

        {/* 按鈕區塊 */}
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          {!currentModifyUserBillConfig ? (
            <CreateUserBillConfigBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          ) : (
            <UpdateUserBillConfigBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
              userBillConfigId={currentModifyUserBillConfig.id}
            />
          )}
        </Grid>
      </>

      {/* 刪除付款帳號 Dialog */}
      {/* {deleteAccountIndex !== -1 ? (
        <DialogAlert
          open={deleteAccountIndex !== -1}
          title={"刪除付款帳號"}
          content={"是否確認要刪除付款帳號？"}
          onConfirm={() => {
            remove(deleteAccountIndex);
            setDeleteAccountIndex(-1);
          }}
          onClose={() => {
            setDeleteAccountIndex(-1);
          }}
        />
      ) : null} */}
    </Dialog>
  );
}

export default UserBillConfigDialog;
