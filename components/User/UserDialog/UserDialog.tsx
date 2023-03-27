import { Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
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
import { InputNumber, InputText } from "@components/Input";
import CreateUserBtn from "@components/User/UserDialog/CreateUserBtn";
import EditUserBtns from "@components/User/UserDialog/EditUserBtns";
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
    label: "用戶總公司地址",
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
  } = useValidatedForm<FormData>(undefined, {
    defaultValues: currentModifyUser
      ? {
          name: currentModifyUser.name,
          companyAddress: currentModifyUser.companyAddress,
          notes: currentModifyUser.notes,
          contactName: currentModifyUser.contactName,
          contactEmail: currentModifyUser.contactEmail,
          contactPhone: currentModifyUser.contactPhone,
          bankAccounts: currentModifyUser.bankAccounts,
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

  const [deleteAccountIndex, setDeleteAccountIndex] = useState<number>(-1);

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

        {bankAccountsFields.map((item, index) => {
          return (
            <Grid container key={item.id} flexWrap={"nowrap"}>
              <Controller
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`帳號${index + 1}`}
                    placeholder={"請填入"}
                  />
                )}
                name={`bankAccounts.${index}.account`}
                control={control}
              />
              <IconBtn
                icon={<CancelOutlinedIcon />}
                onClick={() => {
                  setDeleteAccountIndex(index);
                }}
              />
            </Grid>
          );
        })}

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
                setAddAccountNumber(number);
              }}
            ></InputNumber>
            <Typography variant="subtitle2">付款欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyAccountInput = { account: "", code: "" };
                const emptyArray = [];
                for (let i = 1; i <= addAccountNumber; i++) {
                  emptyArray.push(emptyAccountInput);
                }
                append(emptyArray);
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
      {deleteAccountIndex !== -1 ? (
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
      ) : null}
    </Dialog>
  );
}

export default UserDialog;
