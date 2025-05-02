import {
  Box,
  Button,
  FormControl,
  FormControlLabel,
  FormLabel,
  Grid,
  Radio,
  RadioGroup,
  Typography,
} from "@mui/material";
import { useMemo, useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import {
  CreateRecipientAccountInput,
  ElectricNumberInfoInput,
  User,
  UserContract,
  UserType,
} from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import Chip from "@components/Chip";
import { useUsers } from "@utils/hooks/queries";
import { useCreateUserContract } from "@utils/hooks/mutations/useCreateUserContract";
import { useUpdateUserContract } from "@utils/hooks/mutations/useUpdateUserContract";
import { TableNumbersField } from "@components/UserContract/UserContractDialog/TableNumbersField";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useRouter } from "next/router";
import { toast } from "react-toastify";
import { useCreateDisplayFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/useCreateDisplayFieldConfigs";
import { yupResolver } from "@hookform/resolvers/yup";
import * as yup from "yup";
import { priceValidated } from "@core/types/fieldConfig";
import { contractTimeTypeMap } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/contractTimeType";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserContractDialogProps {
  user: User;
  isOpenDialog: boolean;
  userContract?: UserContract;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const docConfigs: FieldConfig[] = [
  {
    type: "FILE",
    name: "contractDoc",
    label: "用戶契約",
    required: true,
  },
];

function UserContractDialog(props: UserContractDialogProps) {
  const router = useRouter();
  const userId = router.query.userId as string;

  const { isOpenDialog, onClose, userContract, variant, user } = props;

  /** form-data */
  const { control, formState, handleSubmit, reset, watch, setValue } =
    useForm<FormData>({
      defaultValues:
        variant === "edit"
          ? {
              name: userContract?.name,
              userType: userContract?.userType,
              serialNumber: userContract?.serialNumber,
              purchaseDegree: userContract?.purchaseDegree,
              price: Number(userContract?.price),
              upperLimit: Number(userContract?.upperLimit),
              lowerLimit: Number(userContract?.lowerLimit),
              salesAt: new Date(userContract?.salesAt),
              salesTo: new Date(userContract?.salesTo),
              salesPeriod: userContract?.salesPeriod,
              transferAt: new Date(userContract?.transferAt),
              contractDoc: userContract?.contractDoc
                ? {
                    id: userContract.contractDoc,
                    file: { name: userContract?.contractDocName } as File,
                  }
                : undefined,
              contractDocName: userContract?.contractDocName,
              contractTimeType: userContract?.contractTimeType
                ? {
                    value: userContract.contractTimeType,
                    label:
                      contractTimeTypeMap[userContract.contractTimeType] ?? "",
                  }
                : undefined,
              electricNumberInfos: userContract?.electricNumberInfos.map(
                (info) => ({
                  address: info.address,
                  contactEmail: info.contactEmail,
                  contactName: info.contactName,
                  contactPhone: info.contactPhone,
                  companyAddress: info.companyAddress ?? "",
                  recipientAccount: info.recipientAccount
                    ? ({
                        label: `(${info.recipientAccount.bankCode}) ${info.recipientAccount.account}`,
                        value: `${info.recipientAccount.bankCode}|${info.recipientAccount.account}`,
                      } as unknown as CreateRecipientAccountInput)
                    : undefined,
                  degree: info.degree,
                  number: info.number,
                  tableNumbers: info.tableNumbers,
                })
              ),
            }
          : {},
      resolver: (data, context, options) => {
        const resolver: any = yupResolver(
          yup.object().shape({
            name: yup.string().required("請填入用戶名稱"),
            price: priceValidated,
          })
        );

        return resolver(data, context, options);
      },
      mode: "onChange",
    });

  const { errors } = formState;

  const contractTimeType = watch("contractTimeType");
  const salesPeriod = watch("salesPeriod");
  const salesAt = watch("salesAt");
  const setEndedAt = (value: Date) => setValue("salesTo", value);

  const displayFieldConfigs = useCreateDisplayFieldConfigs(
    {
      contractTimeType: contractTimeType?.value,
      salesPeriod: Number(salesPeriod),
      salesAt: salesAt,
    },
    setEndedAt
  );

  const { fields, append, remove } = useFieldArray({
    control,
    name: "electricNumberInfos",
  });

  /** component-state */
  const [addElectricNumber, setAddElectricNumber] = useState<number>(1);
  const [deleteElectricNumberIndex, setDeleteElectricNumberIndex] =
    useState<number>(-1);
  const [electricNumberIndex, setElectricNumberIndex] = useState<number>(-1);

  /** apis */
  const [createUserContract, { loading }] = useCreateUserContract(user.id);
  const [updateUserContract, { loading: updateUserContractLoading }] =
    useUpdateUserContract();
  const { data: usersData } = useUsers({ onlyBasicInformation: true });

  /** selected user/power-plant info */
  const selectedUser = useMemo(() => {
    if (!usersData) return null;

    const selectedUserId = fields[electricNumberIndex]?.id;
    if (!selectedUserId) return null;

    return usersData.users.list.find((u) => u.id === selectedUserId);
  }, [electricNumberIndex, usersData, fields]);

  /** submit */
  const onSubmit = async (formData: FormData) => {
    if (!formData.contractDoc?.id) {
      toast.error("尚未上傳用戶契約");
      return;
    }

    if (variant === "create") {
      await createUserContract({
        variables: {
          userId,
          input: {
            name: formData.name,
            userType: formData.userType,
            serialNumber: formData.serialNumber,
            purchaseDegree: Number(formData.purchaseDegree),
            price: Number(formData.price),
            upperLimit: Number(formData.upperLimit),
            lowerLimit: Number(formData.lowerLimit),
            salesAt: formData.salesAt,
            salesPeriod: formData.salesPeriod,
            transferAt: formData.transferAt,
            contractDoc: formData.contractDoc.id,
            contractDocName: formData.contractDoc.file.name,
            electricNumberInfos: formData.electricNumberInfos.map((info) => {
              const electricNumberInfo: ElectricNumberInfoInput = {
                companyAddress: info.companyAddress,
                address: info.address,
                contactName: info.contactName,
                contactPhone: info.contactPhone,
                contactEmail: info.contactEmail,
                number: info.number,
                tableNumbers: info.tableNumbers,
                degree: Number(info.degree),
              };

              if (info.recipientAccount) {
                electricNumberInfo.recipientAccount = {
                  bankCode: (
                    info.recipientAccount as unknown as Record<string, string>
                  ).value.split("|")[0],
                  account: (
                    info.recipientAccount as unknown as Record<string, string>
                  ).value.split("|")[1],
                  bankBranchCode: "",
                  accountName: "",
                };
              }

              return electricNumberInfo;
            }),
          },
        },
        onCompleted: () => {
          toast.success("新增用戶契約成功");
          reset();
          onClose();
        },
      });
    }

    if (variant === "edit") {
      await updateUserContract({
        variables: {
          input: {
            userContractId: userContract?.id ?? "",
            name: formData.name,
            userType: formData.userType,
            serialNumber: formData.serialNumber,
            purchaseDegree: Number(formData.purchaseDegree),
            price: Number(formData.price),
            upperLimit: Number(formData.upperLimit),
            lowerLimit: Number(formData.lowerLimit),
            salesAt: formData.salesAt,
            salesPeriod: formData.salesPeriod,
            transferAt: formData.transferAt,
            contractDoc: formData.contractDoc.id,
            contractDocName: formData.contractDoc.file.name,
            electricNumberInfos: formData.electricNumberInfos.map((info) => {
              const electricNumberInfo: ElectricNumberInfoInput = {
                companyAddress: info.companyAddress,
                address: info.address,
                contactName: info.contactName,
                contactPhone: info.contactPhone,
                contactEmail: info.contactEmail,
                number: info.number,
                tableNumbers: info.tableNumbers,
                degree: Number(info.degree),
              };

              if (info.recipientAccount) {
                electricNumberInfo.recipientAccount = {
                  bankCode: (
                    info.recipientAccount as unknown as Record<string, string>
                  ).value.split("|")[0],
                  account: (
                    info.recipientAccount as unknown as Record<string, string>
                  ).value.split("|")[1],
                  bankBranchCode: "",
                  accountName: "",
                };
              }

              return electricNumberInfo;
            }),
          },
        },
        onCompleted: () => {
          toast.success("修改用戶契約成功");
          reset();
          onClose();
        },
      });
    }
  };

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增用戶契約" : "修改用戶契約"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        <InputText label="用戶名稱" value={user.name} disabled />

        {/* 契約資訊 Block */}
        <Typography variant="h5" textAlign={"left"}>
          契約資訊
        </Typography>
        <Controller
          control={control}
          name={"userType"}
          render={({ field }) => {
            return (
              <FormControl size="small" sx={{ alignItems: "flex-start" }}>
                <FormLabel sx={{ fontSize: "14px" }}>用戶種類</FormLabel>
                <RadioGroup {...field}>
                  <FormControlLabel
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "16px" },
                    }}
                    value={UserType.Single}
                    control={<Radio size="small" />}
                    label="一般用戶"
                  />
                  <FormControlLabel
                    sx={{
                      "& .MuiFormControlLabel-label": { fontSize: "16px" },
                    }}
                    value={UserType.Multiple}
                    control={<Radio size="small" />}
                    label="單一電號多用戶"
                  />
                </RadioGroup>
              </FormControl>
            );
          }}
        />
        <FieldsController
          configs={displayFieldConfigs}
          form={{ control, errors }}
        />

        {/* 相關文件 Block */}
        <Typography textAlign="left" variant="h5">
          相關文件
        </Typography>
        <FieldsController configs={docConfigs} form={{ control, errors }} />

        {/* 電號資訊 Block */}
        <Typography textAlign="left" variant="h5">
          電號資訊
        </Typography>
        <Box display={"flex"} flexDirection="column" rowGap="24px">
          <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
            {fields.map((item, index) => {
              return (
                <Chip
                  key={item.id}
                  label={`電號${index + 1}`}
                  handleClick={() => setElectricNumberIndex(index)}
                  handleDelete={() => setDeleteElectricNumberIndex(index)}
                  selected={electricNumberIndex === index}
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
              sx={electricNumberIndex !== index ? { display: "none" } : {}}
            >
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.number`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        label="電號"
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.degree`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        type="number"
                        label="年預計採購度數（kWh）"
                        placeholder={"請填入"}
                      />
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.recipientAccount`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    options={
                      user.bankAccounts?.map((bankAccount) => ({
                        label: `(${bankAccount.bankCode}) ${bankAccount.account}`,
                        value: `${bankAccount.bankBranchCode}|${bankAccount.account}`,
                      })) ?? []
                    }
                    label={`銀行帳號`}
                    aria-label={`銀行帳號`}
                    placeholder={"請填入"}
                  />
                )}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.companyAddress`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        type="text"
                        label="發票寄送地址"
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.tableNumbers`}
                render={({ field }) => (
                  <TableNumbersField field={field} control={control} />
                )}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.address`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        label="電號地址"
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.contactName`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        label="聯絡人姓名"
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.contactPhone`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        label="聯絡人電話"
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
              <Controller
                control={control}
                name={`electricNumberInfos.${index}.contactEmail`}
                render={({ field }) => {
                  return (
                    <>
                      <InputText
                        {...field}
                        label="聯絡人信箱"
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
            </Box>
          ))}
        </Box>

        {/* 新增電號欄位 */}
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
              value={addElectricNumber}
              onChange={(number: any) => {
                if (number > 0) {
                  setAddElectricNumber(number);
                }
              }}
            ></InputNumber>
            <Typography variant="subtitle2">電號欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyElectricNumberInput: Omit<
                  ElectricNumberInfoInput,
                  "recipientAccount"
                > & {
                  recipientAccount: string | null;
                } = {
                  address: "",
                  contactEmail: user.contactEmail ?? "",
                  contactName: user.contactName ?? "",
                  contactPhone: user.contactPhone ?? "",
                  companyAddress: user.companyAddress ?? "",
                  recipientAccount: null,
                  degree: 0,
                  number: "",
                  tableNumbers: [],
                };
                const emptyArray = [];
                for (let i = 1; i <= addElectricNumber; i++) {
                  emptyArray.push(emptyElectricNumberInput);
                }
                append(emptyArray as unknown as ElectricNumberInfoInput);
                if (!fields.length) setElectricNumberIndex(0);
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
          <LoadingButton
            startIcon={<AddIcon />}
            variant="contained"
            loading={loading}
            onClick={handleSubmit(onSubmit)}
          >
            儲存
          </LoadingButton>
        </Grid>
      </>

      {deleteElectricNumberIndex !== -1 ? (
        <DialogAlert
          open={deleteElectricNumberIndex !== -1}
          title={"刪除電號"}
          content={"是否確認要刪除電號？"}
          onConfirm={() => {
            remove(deleteElectricNumberIndex);
            setDeleteElectricNumberIndex(-1);
          }}
          onClose={() => {
            setDeleteElectricNumberIndex(-1);
          }}
        />
      ) : null}
    </Dialog>
  );
}

export default UserContractDialog;
