import { Box, Button, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CancelOutlinedIcon from "@mui/icons-material/CancelOutlined";
import { User } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray } from "react-hook-form";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import CreateUserBtn from "@components/User/UserDialog/CreateUserBtn";
import EditUserBtns from "@components/User/UserDialog/EditUserBtns";
import bankJson from "@public/bank_with_branchs_remix_version.json";
import Chip from "@components/Chip";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserDialogProps {
  isOpenDialog: boolean;
  currentModifyUser?: User;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const userInformationConfig: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    label: "用戶名稱",
    placeholder: "請填入",
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "companyAddress",
    label: "發票寄送地址",
    placeholder: "請填入",
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "notes",
    label: "用戶備註",
    placeholder: "請填入",
    validated: textValidated,
  },
];

function UserDialog(props: UserDialogProps) {
  const { isOpenDialog, onClose, currentModifyUser, variant } = props;

  const {
    control,
    formState: { errors },
    handleSubmit,
    watch,
  } = useValidatedForm<FormData>(undefined, {
    defaultValues: currentModifyUser
      ? {
          name: currentModifyUser.name,
          companyAddress: currentModifyUser.companyAddress,
          notes: currentModifyUser.notes,
          contactName: currentModifyUser.contactName,
          contactEmail: currentModifyUser.contactEmail,
          contactPhone: currentModifyUser.contactPhone,
          bankAccounts: (currentModifyUser?.bankAccounts ?? []).map(
            (bankAccount) => ({
              bankCode: {
                label: bankAccount.bankCode,
                value: bankAccount.bankCode,
              },
              bankName: bankAccount.bankName,
              bankBranchCode: {
                label: `${bankAccount.bankBranchCode} ${bankAccount.bankBranchName}`,
                value: bankAccount.bankBranchCode,
              },
              accountName: bankAccount.accountName,
              account: bankAccount.account,
            })
          ),
        }
      : {},
  });
  const {
    fields: bankAccountsFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "bankAccounts",
  });

  const [addAccountNumber, setAddAccountNumber] = useState<number>(1);
  const [deleteBankAccountIndex, setDeleteBankAccountIndex] =
    useState<number>(-1);
  const [bankAccountIndex, setBankAccountIndex] = useState<number>(-1);

  const currentBankCode = watch(
    `bankAccounts.${bankAccountIndex}.bankCode`
  )?.value;

  const currentBankBranchCode = watch(
    `bankAccounts.${bankAccountIndex}.bankBranchCode`
  )?.value;

  const currentBank = useMemo(
    () => (bankJson as any)[currentBankCode],
    [currentBankCode]
  );

  const currentBranchBank = useMemo(() => {
    if (!currentBank) return null;

    return (currentBank?.branchs ?? []).find(
      (x: { branch_code: string }) => x.branch_code === currentBankBranchCode
    );
  }, [currentBank, currentBankBranchCode]);

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增用戶" : "修改用戶"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 用戶資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          用戶資訊
        </Typography>
        <FieldsController
          configs={userInformationConfig}
          form={{ control, errors }}
        />

        {/* 聯絡人資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          聯絡人資訊
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

        {/* 付款 Block */}
        <Typography variant="h5" textAlign={"left"}>
          付款帳號
        </Typography>
        <Box display={"flex"} flexDirection="column" rowGap="24px">
          <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
            {bankAccountsFields.map((item, index) => {
              return (
                <Chip
                  key={item.id}
                  label={
                    item.bankCode.value
                      ? `${item.bankCode.value} ${
                          (bankJson as any)[item.bankCode.value]?.name ?? ""
                        } ${
                          (
                            (bankJson as any)[item.bankCode.value]?.branchs ??
                            []
                          ).find(
                            (x: { branch_code: string }) =>
                              x.branch_code === item.bankBranchCode.value
                          )?.name ?? ""
                        }`
                      : `銀行${index + 1}`
                  }
                  handleClick={() => setBankAccountIndex(index)}
                  handleDelete={() => setDeleteBankAccountIndex(index)}
                />
              );
            })}
          </Box>

          {bankAccountsFields.map((x, index) => (
            <Box
              key={x.id}
              display={"flex"}
              flexDirection="column"
              rowGap="24px"
              sx={bankAccountIndex !== index ? { display: "none" } : {}}
            >
              <Controller
                control={control}
                name={`bankAccounts.${index}.bankCode`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    options={(Object.entries(bankJson) ?? []).map(
                      ([bankCode, bankData]) => ({
                        label: `${bankCode} ${bankData.name}`,
                        value: bankCode,
                      })
                    )}
                    label="銀行代碼"
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`bankAccounts.${index}.bankName`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    value={currentBank?.name ?? ""}
                    label={`銀行名稱`}
                  />
                )}
              />
              <Controller
                control={control}
                name={`bankAccounts.${index}.bankBranchCode`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    options={
                      currentBankCode
                        ? (currentBank?.branchs ?? []).map(
                            (branch: {
                              name: string;
                              branch_code: string;
                            }) => ({
                              label: `${branch.branch_code} ${branch.name}`,
                              value: branch.branch_code,
                            })
                          )
                        : []
                    }
                    label="分行名稱"
                    placeholder={"請填入"}
                    required
                    disabled={!currentBankCode}
                  />
                )}
              />
              <Controller
                control={control}
                name={`bankAccounts.${index}.bankBranchName`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    value={currentBranchBank?.name ?? ""}
                    label={`分行名稱`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`bankAccounts.${index}.accountName`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`戶名`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`bankAccounts.${index}.account`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`帳號`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
            </Box>
          ))}
        </Box>

        {/* 新增付款欄位 */}
        <Grid
          container
          justifyContent={"space-between"}
          alignItems={"center"}
          flexWrap={"nowrap"}
          padding={"8px 16px"}
          border={"2px dashed #B2DFDB"}
          borderRadius={"16px"}
        >
          <Grid container flexWrap={"nowrap"} alignItems={"center"} gap={"8px"}>
            <Typography variant="subtitle2">新增</Typography>
            <InputNumber
              sx={{ width: "74px" }}
              value={addAccountNumber}
              onChange={(number: any) => {
                if (number > 0) {
                  setAddAccountNumber(number);
                }
              }}
            ></InputNumber>
            <Typography variant="subtitle2">付款欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyAccountInput = {
                  bankCode: {
                    label: "",
                    value: "",
                  },
                  bankBranchCode: {
                    label: "",
                    value: "",
                  },
                  bankBranchName: "",
                  bankName: "",
                  accountName: "",
                  account: "",
                };
                const emptyArray = [];
                for (let i = 1; i <= addAccountNumber; i++) {
                  emptyArray.push(emptyAccountInput);
                }
                append(emptyArray);
                if (!bankAccountsFields.length) setBankAccountIndex(0);
              }}
            >
              新增
            </Button>
          </Grid>
        </Grid>

        {/* 按鈕區塊 */}
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          {!currentModifyUser ? (
            <CreateUserBtn handleSubmit={handleSubmit} onClose={onClose} />
          ) : (
            <EditUserBtns
              handleSubmit={handleSubmit}
              id={currentModifyUser.id}
              onClose={onClose}
            />
          )}
        </Grid>
      </>

      {/* 刪除付款帳號 Dialog */}
      {deleteBankAccountIndex !== -1 ? (
        <DialogAlert
          open={deleteBankAccountIndex !== -1}
          title={"刪除付款帳號"}
          content={"是否確認要刪除付款帳號？"}
          onConfirm={() => {
            remove(deleteBankAccountIndex);
            setDeleteBankAccountIndex(-1);
          }}
          onClose={() => {
            setDeleteBankAccountIndex(-1);
          }}
        />
      ) : null}
    </Dialog>
  );
}

export default UserDialog;
