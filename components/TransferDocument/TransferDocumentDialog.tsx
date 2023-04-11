import { Box, Button, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { TransferDocument } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useCreateTransferDocument, useValidatedForm } from "@utils/hooks";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray } from "react-hook-form";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import Chip from "@components/TransferDocument/Chip";
import {
  useLazyUserContracts,
  usePowerPlants,
  useUsers,
} from "@utils/hooks/queries";
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

const transferDocumentInformationConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    label: "轉供合約名稱",
    placeholder: "請填入",
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "number",
    label: "轉供合約編號",
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

const docConfigs: FieldConfig[] = [
  {
    type: "FILE",
    name: "printDoc",
    required: true,
    label: "轉供計畫書用印版",
  },
  {
    type: "FILE",
    name: "replyDoc",
    required: true,
    label: "轉供函覆文",
  },
  {
    type: "FILE",
    name: "wordDoc",
    required: true,
    label: "轉供契約Word版",
  },
  {
    type: "FILE",
    name: "formalDoc",
    required: true,
    label: "正式轉供契約",
  },
];

function TransferDocumentDialog(props: TransferDocumentDialogProps) {
  const { isOpenDialog, onClose, currentModifyTransferDocument, variant } =
    props;

  /** form-data */
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

  /** component-state */
  const [addPowerPlantNumber, setAddPowerPlantNumber] = useState<number>(1);
  const [addUserNumber, setAddUserNumber] = useState<number>(1);

  const [deletePowerPlantIndex, setDeletePowerPlantIndex] =
    useState<number>(-1);
  const [deleteUserIndex, setDeleteUserIndex] = useState<number>(-1);
  const [powerPlantIndex, setPowerPlantIndex] = useState<number>(-1);
  const [userIndex, setUserIndex] = useState<number>(-1);

  /** apis */
  const [createTransferDocument, { loading }] = useCreateTransferDocument();
  const { data: usersData } = useUsers();
  const { data: powerPlantsData } = usePowerPlants();

  const [getUserContracts, { data: userContractsData }] =
    useLazyUserContracts();

  /** submit */
  const onSubmit = async (formData: FormData) => {
    await createTransferDocument({
      variables: {
        input: {
          name: formData.name,
          number: formData.number,
          powerPlants: formData.transferDocumentPowerPlants.map((t) => ({
            estimateAnnualSupply: t.estimateAnnualSupply,
            powerPlantId: t.powerPlant.value,
            transferRate: t.transferRate,
          })),
          printingDoc: formData.printingDoc,
          receptionAreas: formData.receptionAreas,
          replyDoc: formData.replyDoc,
          users: formData.transferDocumentUsers.map((u) => ({
            monthlyTransferDegree: u.monthlyTransferDegree,
            userId: u.user.value,
            userContractId: u.userContract.value,
            yearlyTransferDegree: u.yearlyTransferDegree,
          })),
          wordDoc: formData.wordDoc,
          expectedTime: formData.expectedTime,
          formalDoc: formData.formalDoc,
        },
      },
    });
  };

  const currentPowerPlantNumber = useMemo(
    () =>
      powerPlantsData?.powerPlants.list.find(
        (p) =>
          p.id ===
          transferDocumentPowerPlantsFields[powerPlantIndex]?.powerPlant.value
      )?.number ?? "N/A",
    [powerPlantIndex, powerPlantsData, transferDocumentPowerPlantsFields]
  );

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
          configs={transferDocumentInformationConfigs}
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
            <Box
              key={x.id}
              display={"flex"}
              flexDirection="column"
              rowGap="24px"
              sx={powerPlantIndex !== index ? { display: "none" } : {}}
            >
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.powerPlant`}
                render={({ field }) => (
                  <InputAutocomplete
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
                )}
              />
              <InputText label="電號" value={currentPowerPlantNumber} />
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.transferRate`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`轉供比例（%）`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.estimateAnnualSupply`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`預計年供電度數（MWh）`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
            </Box>
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
            <Box
              key={x.id}
              display={"flex"}
              flexDirection="column"
              rowGap="24px"
              sx={userIndex !== index ? { display: "none" } : {}}
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
                          getUserContracts({
                            variables: { userId: e!.value as string },
                          });
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
              <Controller
                control={control}
                name={`transferDocumentUsers.${index}.monthlyTransferDegree`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`每月轉供契約度數（MWh）`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`transferDocumentUsers.${index}.yearlyTransferDegree`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`年度轉供契約度數（MWh）`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
            </Box>
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
                  userContract: {
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

        <FieldsController configs={docConfigs} form={{ control, errors }} />

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
