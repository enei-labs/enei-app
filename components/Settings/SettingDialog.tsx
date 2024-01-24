import SaveOutlinedIcon from "@mui/icons-material/SaveOutlined";
import { Box, Button, Typography, Grid } from "@mui/material";
import { FieldsController } from "@components/Controller";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import Dialog from "@components/Dialog";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import CancelOutlined from "@mui/icons-material/CancelOutlined";
import { useAuth } from "@core/context/auth";
import { useModifyProfile } from "@utils/hooks/mutations/useModifyProfile";
import { toast } from "react-toastify";
import { LoadingButton } from "@mui/lab";
import { Controller, useFieldArray } from "react-hook-form";
import Chip from "@components/Chip";
import { Role } from "@core/graphql/types";
import { useMemo, useState } from "react";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import bankJson from "@public/bank_with_branchs_remix_version.json";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";

type FormData = {
  name: string;
  company_name: string;
  email: string;
  recipientAccounts?: {
    bankCode: {
      label: string;
      value: string;
    };
    bankName: string;
    bankBranchCode: {
      label: string;
      value: string;
    };
    bankBranchName: string;
    accountName: string;
    account: string;
  }[];
};

interface SettingDialogProps {
  isOpenDialog: boolean;
  onClose: VoidFunction;
}

function SettingDialog(props: SettingDialogProps) {
  const { isOpenDialog, onClose } = props;
  const { me, logIn } = useAuth();
  const settingsFieldConfigs: FieldConfig[] = [
    {
      type: "TEXT",
      name: "name",
      label: "用戶名稱",
      validated: textValidated,
    },
    {
      type: "TEXT",
      name: "company_name",
      label: "公司名稱",
      disabled: true,
    },
    {
      type: "TEXT",
      name: "email",
      label: "用戶信箱",
      validated: textValidated.email(),
    },
  ];

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useValidatedForm<FormData>(settingsFieldConfigs, {
    defaultValues: {
      name: me?.name,
      company_name: me?.companyName,
      email: me?.email,
      recipientAccounts: (me?.recipientAccounts ?? []).map(
        (recipientAccount) => ({
          bankCode: {
            label: recipientAccount.bankCode,
            value: recipientAccount.bankCode,
          },
          bankName: recipientAccount.bankName,
          bankBranchCode: {
            label: `${recipientAccount.bankBranchCode} ${recipientAccount.bankBranchName}`,
            value: recipientAccount.bankBranchCode,
          },
          accountName: recipientAccount.accountName,
          account: recipientAccount.account,
        })
      ),
    },
  });

  const [modifyProfile, { loading }] = useModifyProfile();

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipientAccounts",
  });

  const onSubmit = async (formData: FormData) => {
    const data = await modifyProfile({
      variables: {
        name: formData.name,
        email: formData.email,
        recipientAccounts: (formData.recipientAccounts ?? []).map(
          (recipientAccount) => ({
            bankCode: recipientAccount.bankCode.value,
            bankBranchCode: recipientAccount.bankBranchCode.value,
            accountName: recipientAccount.accountName,
            account: recipientAccount.account,
          })
        ),
      },
    });

    if (data) {
      // refetch 用戶資料
      logIn();
      toast.success("修改成功！");
      onClose();
    }
  };

  const [addRecipientAccountNumber, setAddRecipientAccountNumber] =
    useState<number>(1);
  const [deleteRecipientAccountIndex, setDeleteRecipientAccountIndex] =
    useState<number>(-1);
  const [recipientAccountIndex, setRecipientAccountIndex] =
    useState<number>(-1);

  const currentBankCode = watch(
    `recipientAccounts.${recipientAccountIndex}.bankCode`
  )?.value;

  const currentBankBranchCode = watch(
    `recipientAccounts.${recipientAccountIndex}.bankBranchCode`
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
      <Box
        sx={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
        }}
      >
        <Typography variant="h4" textAlign={"left"}>
          修改個人資料
        </Typography>
        <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
      </Box>
      <Typography variant="h5" textAlign={"left"}>
        個人資料
      </Typography>
      <FieldsController
        configs={settingsFieldConfigs}
        form={{ control, errors }}
      />

      {me?.role === Role.Company ? (
        <>
          {/* 收款帳戶 Block */}
          <Typography variant="h5" textAlign={"left"}>
            收款帳戶
          </Typography>
          <Box display={"flex"} flexDirection="column" rowGap="24px">
            <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
              {fields.map((item, index) => {
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
                    handleClick={() => setRecipientAccountIndex(index)}
                    handleDelete={() => setDeleteRecipientAccountIndex(index)}
                  />
                );
              })}
            </Box>
            {fields.map((x, index) => (
              <Box
                key={x.id}
                display={"flex"}
                flexDirection="column"
                rowGap="24px"
                sx={recipientAccountIndex !== index ? { display: "none" } : {}}
              >
                <Controller
                  control={control}
                  name={`recipientAccounts.${index}.bankCode`}
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
                  name={`recipientAccounts.${index}.bankName`}
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
                  name={`recipientAccounts.${index}.bankBranchCode`}
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
                  name={`recipientAccounts.${index}.bankBranchName`}
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
                  name={`recipientAccounts.${index}.accountName`}
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
                  name={`recipientAccounts.${index}.account`}
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
          {/* 新增收款帳戶欄位 */}
          <Grid
            container
            justifyContent={"space-between"}
            alignItems={"center"}
            flexWrap={"nowrap"}
            padding={"8px 16px"}
            border={"2px dashed #B2DFDB"}
            borderRadius={"16px"}
          >
            <Grid
              container
              flexWrap={"nowrap"}
              alignItems={"center"}
              gap={"8px"}
            >
              <Typography variant="subtitle2">新增</Typography>
              <InputNumber
                sx={{ width: "74px" }}
                value={addRecipientAccountNumber}
                onChange={(number: any) =>
                  number > 0 && setAddRecipientAccountNumber(number)
                }
              ></InputNumber>
              <Typography variant="subtitle2">收款帳戶欄位</Typography>
            </Grid>
            <Grid container justifyContent={"flex-end"}>
              <Button
                startIcon={<AddCircleOutlineOutlinedIcon />}
                onClick={() => {
                  const emptyRecipientAccountInput = {
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
                  for (let i = 1; i <= addRecipientAccountNumber; i++) {
                    emptyArray.push(emptyRecipientAccountInput);
                  }
                  append(emptyArray);
                  if (!fields.length) setRecipientAccountIndex(0);
                }}
              >
                新增
              </Button>
            </Grid>
          </Grid>
        </>
      ) : null}

      <Box
        sx={{
          display: "flex",
          justifyContent: "flex-start",
          alignItems: "center",
          columnGap: "10px",
        }}
      >
        <LoadingButton
          sx={{ height: "40px" }}
          loading={loading}
          startIcon={<SaveOutlinedIcon />}
          onClick={handleSubmit(onSubmit)}
        >
          儲存
        </LoadingButton>
        <Button
          startIcon={<CancelOutlined />}
          sx={{
            height: "40px",
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
          onClick={onClose}
        >
          取消
        </Button>
      </Box>
    </Dialog>
  );
}

export default SettingDialog;
