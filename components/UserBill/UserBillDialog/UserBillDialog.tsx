import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { UserBill } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray } from "react-hook-form";
import { InputText } from "@components/Input";
import RadioGroup from "@components/RadioGroup";
import { ChargeType } from "@core/graphql/types";
import { ElectricNumbersField } from "@components/UserBill/UserBillDialog/ElectricNumbersField";
import { useUsers } from "@utils/hooks/queries";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserBillDialogProps {
  isOpenDialog: boolean;
  currentModifyUserBill?: UserBill;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const ChargeTypeRadios = [
  {
    label: "向用戶收取",
    value: ChargeType.User,
  },
  {
    label: "自行負擔",
    value: ChargeType.Self,
  },
];

const ChargeTypeMap = {
  [ChargeType.User]: "向用戶收取",
  [ChargeType.Self]: "自行負擔",
};

function UserBillDialog(props: UserBillDialogProps) {
  const { isOpenDialog, onClose, currentModifyUserBill, variant } = props;

  const { data, loading } = useUsers();

  const userInformationConfig: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "電費單名稱",
      placeholder: "請填入",
      validated: textValidated,
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
    },
    {
      type: "SINGLE_SELECT",
      name: "recipientAccount",
      label: "收款帳戶",
      placeholder: "請填入",
      validated: textValidated,
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
    },
  ];

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useValidatedForm<FormData>(undefined, {
    defaultValues: currentModifyUserBill
      ? {
          name: currentModifyUserBill.name,
          userId: currentModifyUserBill.user.id,
          recipientAccount: {
            bankCode: currentModifyUserBill.recipientAccount.bankCode,
            bankBranchCode:
              currentModifyUserBill.recipientAccount.bankBranchCode,
            account: currentModifyUserBill.recipientAccount.account,
          },
          estimatedBillDeliverDate:
            currentModifyUserBill.estimatedBillDeliverDate,
          paymentDeadline: currentModifyUserBill.paymentDeadline,
          transportationFee: {
            label: ChargeTypeMap[currentModifyUserBill.transportationFee],
            value: currentModifyUserBill.transportationFee,
          },
          credentialInspectionFee: {
            label: ChargeTypeMap[currentModifyUserBill.credentialInspectionFee],
            value: currentModifyUserBill.credentialInspectionFee,
          },
          credentialServiceFee: {
            label: ChargeTypeMap[currentModifyUserBill.credentialServiceFee],
            value: currentModifyUserBill.credentialServiceFee,
          },
          noticeForTheBuilding: {
            label: currentModifyUserBill.noticeForTheBuilding ? "是" : "否",
            value: currentModifyUserBill.noticeForTheBuilding,
          },
          noticeForTPCBill: {
            label: currentModifyUserBill.noticeForTPCBill ? "是" : "否",
            value: currentModifyUserBill.noticeForTPCBill,
          },
          electricNumberInfos: (
            currentModifyUserBill.electricNumberInfos ?? []
          ).map((info) => ({
            number: info.number,
            price: info.price,
          })),
          contactName: currentModifyUserBill.contactName,
          contactEmail: currentModifyUserBill.contactEmail,
          contactPhone: currentModifyUserBill.contactPhone,
        }
      : {},
  });
  const userId = watch("userId");

  const [addAccountNumber, setAddAccountNumber] = useState<number>(1);

  const [deleteAccountIndex, setDeleteAccountIndex] = useState<number>(-1);

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增電費單組合" : "修改電費單組合"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 用戶資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          電費單設定
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
                label="憑證查驗費"
                radios={ChargeTypeRadios}
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
              />
            );
          }}
        />

        <Controller
          control={control}
          name={"noticeForTheBuilding"}
          render={({ field }) => {
            return (
              <RadioGroup
                {...field}
                label="是否需要大樓通知單"
                radios={ChargeTypeRadios}
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
                radios={ChargeTypeRadios}
              />
            );
          }}
        />

        {/* 用戶電號 Block */}
        <Typography variant="h5" textAlign={"left"}>
          用戶電號
        </Typography>

        {userId ? (
          <Controller
            control={control}
            name={`electricNumberInfos`}
            render={({ field }) => (
              <ElectricNumbersField
                field={field}
                control={control}
                userId={userId}
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
                  label={"聯絡人姓名"}
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
                  label={"聯絡人電話"}
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
                label={"聯絡人信箱"}
                {...field}
                placeholder={"請填入"}
                required
              />
            </>
          )}
        ></Controller>

        {/* 按鈕區塊 */}
        {/* <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          {!currentModifyUserBill ? (
            <CreateUserBtn handleSubmit={handleSubmit} onClose={onClose} />
          ) : (
            <EditUserBtns
              handleSubmit={handleSubmit}
              id={currentModifyUserBill.id}
              onClose={onClose}
            />
          )}
        </Grid> */}
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

export default UserBillDialog;
