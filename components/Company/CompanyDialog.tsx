import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { taiwanUBNValidation, textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import {
  useCreateOrUpdate,
  useUpdateCompany,
  useValidatedForm,
} from "@utils/hooks";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { toast } from "react-toastify";
import { Company } from "@core/graphql/types";
import { useCreateCompany } from "@utils/hooks/mutations/useCreateCompany";
import { COMPANIES } from "@core/graphql/queries";
import { Controller } from "react-hook-form";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import Chip from "@components/Chip";
import { useFieldArray } from "react-hook-form";
import { useMemo, useState } from "react";
import bankJson from "@public/bank_with_branchs_remix_version.json";
import DialogAlert from "@components/DialogAlert";
import { DialogErrorBoundary } from "@components/ErrorBoundary";

type FormData = {
  name: string;
  taxId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  recipientAccounts: {
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

const configs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    label: "公司名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "taxId",
    label: "統一編號",
    required: true,
    validated: taiwanUBNValidation,
  },
  {
    type: "TEXT",
    name: "contactName",
    label: "聯絡人姓名",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "contactPhone",
    label: "聯絡人電話",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "contactEmail",
    label: "聯絡人信箱",
    required: true,
    validated: textValidated.email("請輸入有效的電子郵件地址"),
  },
];

interface CompanyDialogProps {
  open: boolean;
  variant: "edit" | "create";
  onClose: VoidFunction;
  defaultValues?: Company;
}

const CompanyDialog = (props: CompanyDialogProps) => {
  const { open, onClose, variant, defaultValues } = props;

  const [createCompany, updateCompany, loading] = useCreateOrUpdate(
    variant,
    useCreateCompany,
    useUpdateCompany
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useValidatedForm<FormData>(configs, {
    defaultValues: {
      ...defaultValues,
      recipientAccounts: (defaultValues?.recipientAccounts ?? []).map(
        (bankAccount) => ({
          bankCode: {
            label: bankAccount.bankCode,
            value: bankAccount.bankCode,
          },
          bankName: bankAccount.bankName,
          bankBranchCode: {
            label: `${bankAccount.bankBranchCode}`,
            value: bankAccount.bankBranchCode,
          },
          accountName: bankAccount.accountName,
          account: bankAccount.account,
        })
      ),
    },
  });

  const [addAccountNumber, setAddAccountNumber] = useState<number>(1);
  const [deleteBankAccountIndex, setDeleteBankAccountIndex] =
    useState<number>(-1);
  const [bankAccountIndex, setBankAccountIndex] = useState<number>(-1);

  const currentBankCode = watch(
    `recipientAccounts.${bankAccountIndex}.bankCode`
  )?.value;

  const currentBankBranchCode = watch(
    `recipientAccounts.${bankAccountIndex}.bankBranchCode`
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

  const { fields, append, remove } = useFieldArray({
    control,
    name: "recipientAccounts",
  });

  const onSubmit = async (formData: FormData) => {
    if (variant === "create") {
      const { data } = await createCompany({
        variables: {
          input: {
            name: formData.name,
            taxId: formData.taxId,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            recipientAccounts: (formData.recipientAccounts ?? []).map(
              (bankAccount) => ({
                bankCode: bankAccount.bankCode.value,
                account: bankAccount.account,
              })
            ),
          },
        },
        refetchQueries: [COMPANIES],
      });
    }

    if (variant === "edit" && defaultValues) {
      await updateCompany({
        variables: {
          input: {
            companyId: defaultValues.id,
            name: formData.name,
            taxId: formData.taxId,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            recipientAccounts: (formData.recipientAccounts ?? []).map(
              (bankAccount) => ({
                bankCode: bankAccount.bankCode.value,
                account: bankAccount.account,
                accountName: bankAccount.accountName,
                bankBranchCode: bankAccount.bankBranchCode.value,
              })
            ),
          },
        },
        onCompleted: () => {
          toast.success("更新成功");
          onClose();
        },
      });
    }
  };

  return (
    <Dialog key="form" open={open} onClose={onClose}>
      <DialogErrorBoundary onClose={onClose}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          公司資訊
        </Typography>
        <IconBtn icon={<CloseIcon />} onClick={onClose} />
      </Grid>
      <FieldsController
        configs={configs.slice(0, 2)}
        form={{ control, errors }}
      />

      <Typography variant="h5">聯絡人資訊</Typography>
      <FieldsController configs={configs.slice(2)} form={{ control, errors }} />

      {/* 收款 Block */}
      <Typography variant="h5" textAlign={"left"}>
        收款帳號
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
                          (bankJson as any)[item.bankCode.value]?.branchs ?? []
                        ).find(
                          (x: { branch_code: string }) =>
                            x.branch_code === item.bankBranchCode.value
                        )?.name ?? ""
                      }`
                    : `銀行${index + 1}`
                }
                handleClick={() => setBankAccountIndex(index)}
                handleDelete={() => setDeleteBankAccountIndex(index)}
                selected={bankAccountIndex === index}
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
            sx={bankAccountIndex !== index ? { display: "none" } : {}}
          >
            <Controller
              control={control}
              name={`recipientAccounts.${index}.bankCode`}
              render={({ field }) => (
                <InputAutocomplete
                  {...field}
                  filterOptions={true}
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
            {/* <Controller
              control={control}
              name={`recipientAccounts.${index}.bankName`}
              render={({ field }) => (
                <InputText
                  {...field}
                  value={currentBank?.name ?? ""}
                  label={`銀行名稱`}
                />
              )}
            /> */}
            <Controller
              control={control}
              name={`recipientAccounts.${index}.bankBranchCode`}
              render={({ field }) => (
                <InputAutocomplete
                  {...field}
                  filterOptions={true}
                  options={
                    currentBankCode
                      ? (currentBank?.branchs ?? []).map(
                          (branch: { name: string; branch_code: string }) => ({
                            label: `${branch.branch_code} ${branch.name}`,
                            value: branch.branch_code,
                          })
                        )
                      : []
                  }
                  label="分行代碼"
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
              for (let i = 1; i <= addAccountNumber; i++) {
                emptyArray.push(emptyRecipientAccountInput);
              }
              append(emptyArray);
              if (!fields.length) setBankAccountIndex(0);
            }}
          >
            新增
          </Button>
        </Grid>
      </Grid>

        {deleteBankAccountIndex !== -1 ? (
        <DialogAlert
          open={deleteBankAccountIndex !== -1}
          title={"刪除收款帳號"}
          content={"是否確認要刪除收款帳號？"}
          onConfirm={() => {
            remove(deleteBankAccountIndex);
            setDeleteBankAccountIndex(-1);
          }}
          onClose={() => {
            setDeleteBankAccountIndex(-1);
          }}
        />
        ) : null}

        <LoadingButton
        startIcon={<AddIcon />}
        variant="contained"
        loading={loading}
        onClick={handleSubmit(onSubmit)}
      >
        儲存
      </LoadingButton>
      </DialogErrorBoundary>
    </Dialog>
  );
};

export default CompanyDialog;
