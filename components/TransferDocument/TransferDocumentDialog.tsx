import { Box, Button, Grid, Typography } from "@mui/material";
import { useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { TransferDocument } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useValidatedForm } from "@utils/hooks";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray } from "react-hook-form";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import Chip from "@components/TransferDocument/Chip";
import { usePowerPlants, useUsers } from "@utils/hooks/queries";
const DialogAlert = dynamic(() => import("@components/DialogAlert"));
const CreateTransferDocumentBtn = dynamic(
  () => import("@components/TransferDocument/CreateTransferDocumentBtn")
);

interface TransferDocumentDialogProps {
  isOpenDialog: boolean;
  currentModifyTransferDocument?: TransferDocument;
  variant: "edit" | "create";
  onClose: VoidFunction;
}

const transferDocumentInformationConfig: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    label: "轉供合約名稱",
    placeholder: "請填入",
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "receptionAreas",
    label: "轉供受理區處",
    placeholder: "請填入",
    validated: textValidated,
  },
  {
    type: "DATE",
    name: "expectedTime",
    label: "期望完成日",
    placeholder: "請填入",
  },
];

function TransferDocumentDialog(props: TransferDocumentDialogProps) {
  const { isOpenDialog, onClose, currentModifyTransferDocument, variant } =
    props;

  const {
    control,
    formState: { errors },
    handleSubmit,
  } = useValidatedForm<FormData>(undefined, {
    defaultValues: currentModifyTransferDocument
      ? {
          name: currentModifyTransferDocument.name,
          receptionAreas: currentModifyTransferDocument.receptionAreas,
          expectedTime: currentModifyTransferDocument.expectedTime,
          printingDoc: currentModifyTransferDocument.printingDoc,
          replyDoc: currentModifyTransferDocument.replyDoc,
          wordDoc: currentModifyTransferDocument.wordDoc,
          formalDoc: currentModifyTransferDocument.formalDoc,
          transferDocumentPowerPlants:
            currentModifyTransferDocument.transferDocumentPowerPlants.map(
              (t) => ({
                estimateAnnualSupply: t.estimateAnnualSupply,
                powerPlant: {
                  label: t.powerPlant.name,
                  value: t.powerPlant.id,
                },
                transferRate: t.transferRate,
              })
            ),
          transferDocumentUsers:
            currentModifyTransferDocument.transferDocumentUsers.map((u) => ({
              monthlyTransferDegree: u.monthlyTransferDegree,
              user: {
                label: u.user.name,
                value: u.user.id,
              },
              yearlyTransferDegree: u.yearlyTransferDegree,
            })),
        }
      : {},
  });
  const {
    fields: transferDocumentPowerPlantsFields,
    append,
    remove,
  } = useFieldArray({
    control,
    name: "transferDocumentPowerPlants",
  });

  const {
    fields: transferDocumentUsersFields,
    append: userAppend,
    remove: userRemove,
  } = useFieldArray({
    control,
    name: "transferDocumentUsers",
  });

  console.log({ transferDocumentUsersFields });

  const [addPowerPlantNumber, setAddPowerPlantNumber] = useState<number>(1);
  const [addUserNumber, setAddUserNumber] = useState<number>(1);

  const [deletePowerPlantIndex, setDeletePowerPlantIndex] =
    useState<number>(-1);
  const [deleteUserIndex, setDeleteUserIndex] = useState<number>(-1);
  const [powerPlantIndex, setPowerPlantIndex] = useState<number>(-1);
  const [userIndex, setUserIndex] = useState<number>(-1);

  console.log({ userIndex });

  const { data: usersData } = useUsers();
  const { data: powerPlantsData } = usePowerPlants();

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <>
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            {variant === "create" ? "新增轉供合約" : "修改轉供合約"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 轉供資料 Block */}
        <Typography variant="h5" textAlign={"left"}>
          轉供資料
        </Typography>
        <FieldsController
          configs={transferDocumentInformationConfig}
          form={{ control, errors }}
        />

        {/* 電廠 Block */}
        <Typography variant="h5" textAlign={"left"}>
          電廠
        </Typography>
        <Box display={"flex"} flexDirection="column" rowGap="24px">
          <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
            {transferDocumentPowerPlantsFields.map((item, index) => {
              return (
                <Chip
                  key={item.id}
                  label={`電廠${index + 1}`}
                  handleClick={() => setPowerPlantIndex(index)}
                  handleDelete={() => setDeletePowerPlantIndex(index)}
                />
              );
            })}
          </Box>
          {transferDocumentPowerPlantsFields.map((x, index) => (
            <Controller
              key={x.id}
              control={control}
              name={`transferDocumentPowerPlants.${index}.powerPlant`}
              render={({ field }) => (
                <>
                  <InputAutocomplete
                    sx={powerPlantIndex !== index ? { display: "none" } : {}}
                    {...field}
                    options={
                      powerPlantsData?.powerPlants.list.map((o) => ({
                        label: o.name,
                        value: o.id,
                      })) ?? []
                    }
                    label={`電廠${index + 1}名稱`}
                    placeholder={"請填入"}
                    required
                  />
                </>
              )}
            ></Controller>
          ))}
        </Box>

        {/* 新增電廠欄位 */}
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
              value={addPowerPlantNumber}
              onChange={(number: any) => setAddPowerPlantNumber(number)}
            ></InputNumber>
            <Typography variant="subtitle2">電廠欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyPowerPlantInput = {
                  estimateAnnualSupply: 0,
                  powerPlant: {
                    label: "",
                    value: "",
                  },
                  transferRate: 0,
                };
                const emptyArray = [];
                for (let i = 1; i <= addPowerPlantNumber; i++) {
                  emptyArray.push(emptyPowerPlantInput);
                }
                append(emptyArray);
                if (!transferDocumentPowerPlantsFields.length)
                  setPowerPlantIndex(0);
              }}
            >
              新增
            </Button>
          </Grid>
        </Grid>

        {/* 用戶 Block */}
        <Typography variant="h5" textAlign={"left"}>
          用戶
        </Typography>
        <Box display={"flex"} flexDirection="column" rowGap="24px">
          <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
            {transferDocumentUsersFields.map((item, index) => {
              return (
                <Chip
                  key={item.id}
                  label={`用戶${index + 1}`}
                  handleClick={() => setUserIndex(index)}
                  handleDelete={() => setDeleteUserIndex(index)}
                />
              );
            })}
          </Box>
          {transferDocumentUsersFields.map((x, index) => (
            <Controller
              key={x.id}
              control={control}
              name={`transferDocumentUsers.${index}.user`}
              render={({ field }) => {
                console.log({ field });
                return (
                  <>
                    <InputAutocomplete
                      sx={userIndex !== index ? { display: "none" } : {}}
                      {...field}
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
          ))}
        </Box>

        {/* 新增用戶欄位 */}
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
              value={addUserNumber}
              onChange={(number: any) => {
                setAddUserNumber(number);
              }}
            ></InputNumber>
            <Typography variant="subtitle2">用戶欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyUserInput = {
                  monthlyTransferDegree: 0,
                  user: {
                    label: "",
                    value: "",
                  },
                  yearlyTransferDegree: 0,
                };
                const emptyArray = [];
                for (let i = 1; i <= addUserNumber; i++) {
                  emptyArray.push(emptyUserInput);
                }
                userAppend(emptyArray);
                if (!transferDocumentUsersFields.length) setUserIndex(0);
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
          {!currentModifyTransferDocument ? (
            <CreateTransferDocumentBtn
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          ) : null}
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

      {/* 刪除付款帳號 Dialog */}
      {deletePowerPlantIndex !== -1 ? (
        <DialogAlert
          open={deletePowerPlantIndex !== -1}
          title={"刪除電廠"}
          content={"是否確認要刪除電廠？"}
          onConfirm={() => {
            remove(deletePowerPlantIndex);
            setDeletePowerPlantIndex(-1);
          }}
          onClose={() => {
            setDeletePowerPlantIndex(-1);
          }}
        />
      ) : null}
      {deleteUserIndex !== -1 ? (
        <DialogAlert
          open={deletePowerPlantIndex !== -1}
          title={"刪除用戶"}
          content={"是否確認要刪除用戶？"}
          onConfirm={() => {
            userRemove(deletePowerPlantIndex);
            setDeletePowerPlantIndex(-1);
          }}
          onClose={() => {
            setDeletePowerPlantIndex(-1);
          }}
        />
      ) : null}
    </Dialog>
  );
}

export default TransferDocumentDialog;
