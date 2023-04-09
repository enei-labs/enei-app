import { Box, Button, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { ElectricNumberInfo, TransferDocument } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray } from "react-hook-form";
import { InputAutocomplete, InputNumber } from "@components/Input";
import Chip from "@components/TransferDocument/Chip";
import { useUsers } from "@utils/hooks/queries";
import { useCreateUserContract } from "@utils/hooks/mutations/useCreateUserContract";
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
    type: "FILE",
    name: "number",
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

const contactConfigs: FieldConfig[] = [
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
    validated: textValidated.email(),
  },
];

// const electricConfigs: FieldConfig[] = [
//   {
//     type: "TEXT",
//     name: "contactName",
//     label: "電號",
//     required: true,
//     validated: textValidated,
//   },
// ];

function UserContractDialog(props: UserContractDialogProps) {
  const { isOpenDialog, onClose, currentModifyTransferDocument, variant } =
    props;

  /** form-data */
  const {
    control,
    formState: { errors },
    handleSubmit,
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
  const { data: usersData } = useUsers();

  /** selected user/power-plant info */
  const selectedUser = useMemo(() => {
    if (!usersData) return null;

    const selectedUserId = fields[electricNumberIndex]?.id;
    if (!selectedUserId) return null;

    return usersData.users.list.find((u) => u.id === selectedUserId);
  }, [electricNumberIndex, usersData, fields]);

  /** submit */
  const onSubmit = async (formData: FormData) => {
    await createUserContract({
      variables: {
        input: {
          name: formData.name,
          userType: formData.userType,
          serialNumber: formData.serialNumber,
          purchaseDegree: formData.purchaseDegree,
          price: formData.price,
          upperLimit: formData.upperLimit,
          lowerLimit: formData.lowerLimit,
          salesPeriod: formData.salesPeriod,
          transferAt: formData.transferAt,
          contractDoc: formData.contractDoc,
          electricNumberInfos: formData.electricNumberInfos,
        },
      },
    });
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
          {/* {fields.map((x, index) => (
            <Box
              key={x.id}
              sx={electricNumberIndex !== index ? { display: "none" } : {}}
            >
              <Controller
                key={x.id}
                control={control}
                name={`transferDocumentUsers.${index}.user`}
                render={({ field }) => {
                  return (
                    <>
                      <InputAutocomplete
                        {...field}
                        onChange={(e) => {
                          field.onChange(e);
                          refetch({ userId: e!.value as string });
                        }}
                        options={
                          usersData?.users.list.map((o) => ({
                            label: o.name,
                            value: o.id,
                          })) ?? []
                        }
                        label={`用戶${index + 1}名稱`}
                        placeholder={"請填入"}
                        required
                      />
                    </>
                  );
                }}
              />
              {userContractsData ? (
                <Controller
                  control={control}
                  name={`transferDocumentUsers.${index}.userContract`}
                  render={({ field }) => (
                    <InputAutocomplete
                      {...field}
                      options={
                        userContractsData?.userContracts.list.map((o) => ({
                          label: o.serialNumber,
                          value: o.id,
                        })) ?? []
                      }
                      label={`電號`}
                      placeholder={"請填入"}
                      required
                    />
                  )}
                />
              ) : null}
            </Box>
          ))} */}
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
                  contractEmail: "",
                  contractName: "",
                  contractPhone: "",
                  degree: 0,
                  lowerLimit: 0,
                  number: "",
                  tableNumbers: [],
                  upperLimit: 0,
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

        <FieldsController configs={docConfigs} form={{ control, errors }} />

        {/* 按鈕區塊 */}
        <Grid
          container
          justifyContent={"flex-start"}
          alignItems={"center"}
          gap={"10px"}
        >
          {/* {!currentModifyTransferDocument ? (
            <CreateTransferDocumentBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          ) : null} */}
          {/* {!currentModifyTransferDocument ? (
            <CreateTransferDocumentBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          ) : (
            <EditTransferDocumentBtns
              handleSubmit={handleSubmit}
              id={currentModifyTransferDocument.id}
              onClose={onClose}
            />
          )} */}
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
