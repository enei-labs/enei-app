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
  ElectricNumberInfo,
  TransferDocument,
  UserType,
} from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { useValidatedForm } from "@utils/hooks";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray } from "react-hook-form";
import { InputNumber, InputText } from "@components/Input";
import Chip from "@components/Chip";
import { useUsers } from "@utils/hooks/queries";
import { useCreateUserContract } from "@utils/hooks/mutations/useCreateUserContract";
import { TableNumbersField } from "@components/UserContract/UserContractDialog/TableNumbersField";
import { LoadingButton } from "@mui/lab";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useRouter } from "next/router";
import { toast } from "react-toastify";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));

interface UserContractDialogProps {
  isOpenDialog: boolean;
  currentModifyTransferDocument?: TransferDocument;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const contractConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    required: true,
    label: "契約名稱",
  },
  {
    type: "TEXT",
    name: "serialNumber",
    required: true,
    label: "契約編號",
  },
  {
    type: "NUMBER",
    name: "price",
    required: true,
    label: "採購電價（元/kWh）",
  },
  {
    type: "NUMBER",
    name: "purchaseDegree",
    required: true,
    label: "契約總預計年採購度數（kWh）",
  },
  {
    type: "NUMBER",
    name: "upperLimit",
    required: true,
    label: "預計最高採購上限（契約）（kWh）",
  },
  {
    type: "NUMBER",
    name: "lowerLimit",
    required: true,
    label: "預計最低採購下限（契約）（kWh）",
  },
  {
    type: "DATE",
    name: "salesAt",
    required: true,
    label: "契約生效日期",
  },
  {
    type: "NUMBER",
    name: "salesPeriod",
    required: true,
    label: "賣電年限",
  },
  {
    type: "DATE",
    name: "transferAt",
    required: true,
    label: "預計開始轉供綠電日期",
  },
];

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

  const { isOpenDialog, onClose, currentModifyTransferDocument, variant } =
    props;

  /** form-data */
  const {
    control,
    formState: { errors },
    handleSubmit,
    reset,
  } = useValidatedForm<FormData>(undefined, {
    defaultValues: {},
  });
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
  const [createUserContract, { loading }] = useCreateUserContract();
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
    if (!formData.contractDoc) {
      toast.error("尚未上傳用戶契約");
    }

    const { data } = await createUserContract({
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
          electricNumberInfos: formData.electricNumberInfos.map((info) => ({
            ...info,
            degree: Number(info.degree),
          })),
        },
      },
    });

    if (data?.createUserContract.__typename === "UserContract") {
      reset();
      onClose();
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
          configs={contractConfigs}
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
                setAddElectricNumber(number);
              }}
            ></InputNumber>
            <Typography variant="subtitle2">電號欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyElectricNumberInput: ElectricNumberInfo = {
                  address: "",
                  contactEmail: "",
                  contactName: "",
                  contactPhone: "",
                  degree: 0,
                  number: "",
                  tableNumbers: [],
                };
                const emptyArray = [];
                for (let i = 1; i <= addElectricNumber; i++) {
                  emptyArray.push(emptyElectricNumberInput);
                }
                append(emptyArray);
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
            新增
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
