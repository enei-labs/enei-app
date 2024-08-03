import { Box, Button, Grid, Typography } from "@mui/material";
import { useMemo, useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import AddCircleOutlineOutlinedIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { TransferDocument } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { Controller, useFieldArray, useForm } from "react-hook-form";
import { InputAutocomplete, InputNumber, InputText } from "@components/Input";
import Chip from "@components/Chip";
import {
  useFetchCompaniesAllData,
  useLazyUserContracts,
  useUsers,
} from "@utils/hooks/queries";
import EditTransferDocumentBtn from "@components/TransferDocument/TransferDocumentDialog/EditTransferDocumentBtn";
const DialogAlert = dynamic(() => import("@components/DialogAlert"));
const CreateTransferDocumentBtn = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/CreateTransferDocumentBtn"
    )
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
    required: true,
  },
  {
    type: "TEXT",
    name: "number",
    label: "轉供契約編號",
    placeholder: "請填入",
    required: true,
  },
  {
    type: "TEXT",
    name: "receptionAreas",
    label: "轉供受理區處",
    placeholder: "請填入",
    validated: textValidated,
    required: true,
  },
  {
    type: "DATE",
    name: "expectedTime",
    label: "期望完成日",
    placeholder: "請填入",
    required: true,
  },
];

const docConfigs: FieldConfig[] = [
  {
    type: "FILE",
    name: "printingDoc",
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
    watch,
    control,
    formState: { errors },
    handleSubmit,
  } = useForm<FormData>({
    defaultValues: currentModifyTransferDocument
      ? {
          name: currentModifyTransferDocument.name,
          number: currentModifyTransferDocument.number,
          receptionAreas: currentModifyTransferDocument.receptionAreas,
          expectedTime: currentModifyTransferDocument.expectedTime,
          printingDoc: {
            file: undefined,
            id: currentModifyTransferDocument.printingDoc,
          },
          replyDoc: {
            file: undefined,
            id: currentModifyTransferDocument.replyDoc,
          },
          wordDoc: {
            file: undefined,
            id: currentModifyTransferDocument.wordDoc,
          },
          formalDoc: {
            file: undefined,
            id: currentModifyTransferDocument.formalDoc,
          },
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
              expectedYearlyPurchaseDegree: u.expectedYearlyPurchaseDegree,
              monthlyTransferDegree: u.monthlyTransferDegree,
              user: {
                label: u.user.name,
                value: u.user.id,
              },
              yearlyTransferDegree: u.yearlyTransferDegree,
              userContract: {
                label: u.userContract.name,
                value: u.userContract.id,
              },
              electricNumber: {
                label: u.electricNumberInfo.number,
                value: u.electricNumberInfo.number,
              },
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
  const { data: usersData } = useUsers({ onlyBasicInformation: true });
  const { data: companiesData } = useFetchCompaniesAllData();

  const powerPlants = useMemo(() => {
    return (
      (companiesData?.companies.list ?? [])
        .map((c) => c.companyContracts.map((cc) => cc.powerPlants))
        .flat()
        .flat() ?? []
    );
  }, [companiesData]);

  const [getUserContracts, { data: userContractsData }] =
    useLazyUserContracts();

  const currentCompany = watch(
    `transferDocumentPowerPlants.${powerPlantIndex}.company`
  );

  const currentCompanyContract = watch(
    `transferDocumentPowerPlants.${powerPlantIndex}.companyContract`
  );

  const currentPowerPlant = watch(
    `transferDocumentPowerPlants.${powerPlantIndex}.powerPlant`
  );

  const currentUserContract = watch(
    `transferDocumentUsers.${userIndex}.userContract`
  );

  const currentCompanyInfo = useMemo(() => {
    const company = companiesData?.companies.list.find(
      (c) => c.id === currentCompany?.value
    );

    return company ?? null;
  }, [companiesData, currentCompany]);

  const currentCompanyContractInfo = useMemo(() => {
    return (
      currentCompanyInfo?.companyContracts.find(
        (cc) => cc.id === currentCompanyContract?.value
      ) ?? null
    );
  }, [currentCompanyInfo, currentCompanyContract]);

  const currentPowerPlantInfo = useMemo(() => {
    const powerPlant = powerPlants.find(
      (p) => p.id === currentPowerPlant?.value
    );

    return {
      number: powerPlant?.number ?? 0,
      volume: (powerPlant?.volume ?? 0) / 1000,
      estimatedAnnualPowerGeneration:
        powerPlant?.estimatedAnnualPowerGeneration ?? 0,
    };
  }, [powerPlants, currentPowerPlant]);

  const transferDocumentPowerPlants = watch("transferDocumentPowerPlants");

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
                  aria-label={`電廠${index + 1}`}
                  handleClick={() => setPowerPlantIndex(index)}
                  handleDelete={() => setDeletePowerPlantIndex(index)}
                  selected={powerPlantIndex === index}
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
                name={`transferDocumentPowerPlants.${index}.company`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    onChange={(e) => field.onChange(e)}
                    options={
                      companiesData?.companies.list.map((o) => ({
                        label: o.name,
                        value: o.id,
                      })) ?? []
                    }
                    label={`公司${index + 1}名稱`}
                    aria-label={`公司${index + 1}名稱`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.companyContract`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    disabled={!currentCompanyInfo}
                    onChange={(e) => field.onChange(e)}
                    options={
                      currentCompanyInfo?.companyContracts?.map((o) => ({
                        label: `${o.name}(${o.number})`,
                        value: o.id,
                      })) ?? []
                    }
                    label={`公司合約${index + 1}名稱`}
                    aria-label={`公司合約${index + 1}名稱`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.powerPlant`}
                render={({ field }) => (
                  <InputAutocomplete
                    {...field}
                    disabled={!currentCompanyContractInfo}
                    onChange={(e) => field.onChange(e)}
                    options={
                      currentCompanyContractInfo?.powerPlants?.map((o) => ({
                        label: o.name,
                        value: o.id,
                      })) ?? []
                    }
                    label={`電廠${index + 1}名稱`}
                    aria-label={`電廠${index + 1}名稱`}
                    placeholder={"請填入"}
                    required
                  />
                )}
              />
              <InputText
                label="電號"
                value={currentPowerPlantInfo.number ?? "N/A"}
                disabled
              />
              <InputText
                label="裝置容量（kW）"
                value={currentPowerPlantInfo.volume ?? "N/A"}
                disabled
              />
              <InputText
                label="預計年發電量（kWh）"
                value={new Intl.NumberFormat().format(
                  currentPowerPlantInfo.volume *
                    currentPowerPlantInfo.estimatedAnnualPowerGeneration
                )}
                disabled
              />
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.transferRate`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`轉供比例（%）`}
                    aria-label={`轉供比例（%）`}
                    placeholder={"請填入"}
                    required
                  />
                )}
                rules={{ max: 100, min: 0 }}
              />
              <Controller
                control={control}
                name={`transferDocumentPowerPlants.${index}.estimateAnnualSupply`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`預計年供電度數（kWh）`}
                    aria-label={`預計年供電度數（kWh）`}
                    placeholder={"請填入"}
                    disabled
                    value={new Intl.NumberFormat().format(
                      currentPowerPlantInfo.volume *
                        currentPowerPlantInfo.estimatedAnnualPowerGeneration *
                        transferDocumentPowerPlants[index].transferRate
                    )}
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
              onChange={(number: any) =>
                number > 0 && setAddPowerPlantNumber(number)
              }
            ></InputNumber>
            <Typography variant="subtitle2">電廠欄位</Typography>
          </Grid>
          <Grid container justifyContent={"flex-end"}>
            <Button
              startIcon={<AddCircleOutlineOutlinedIcon />}
              onClick={() => {
                const emptyPowerPlantInput = {
                  estimateAnnualSupply: 0,
                  company: {
                    label: "",
                    value: "",
                  },
                  companyContract: {
                    label: "",
                    value: "",
                  },
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
          用戶電號
        </Typography>
        <Box display={"flex"} flexDirection="column" rowGap="24px">
          <Box display={"flex"} gap="8px" flexWrap={"wrap"}>
            {transferDocumentUsersFields.map((item, index) => {
              return (
                <Chip
                  key={item.id}
                  label={`電號${index + 1}`}
                  aria-label={`電號${index + 1}`}
                  handleClick={() => setUserIndex(index)}
                  handleDelete={() => setDeleteUserIndex(index)}
                  selected={userIndex === index}
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
                        onChange={(e, newValue) => {
                          field.onChange(e, newValue);
                          if (e.value) {
                            getUserContracts({
                              variables: { userId: e.value },
                            });
                          }
                        }}
                        options={
                          usersData?.users.list.map((o) => ({
                            label: o.name,
                            value: o.id,
                          })) ?? []
                        }
                        label={`用戶名稱`}
                        aria-label={`用戶名稱`}
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
                      onChange={(e) => field.onChange(e)}
                      options={
                        userContractsData?.userContracts.list.map((o) => ({
                          label: `${o.serialNumber}(${o.name})`,
                          value: o.id,
                        })) ?? []
                      }
                      label={`用戶契約編號`}
                      aria-label={`用戶契約編號`}
                      placeholder={"請填入"}
                      required
                    />
                  )}
                />
              ) : null}
              {currentUserContract?.value ? (
                <Controller
                  control={control}
                  name={`transferDocumentUsers.${index}.electricNumber`}
                  render={({ field }) => (
                    <InputAutocomplete
                      {...field}
                      options={
                        userContractsData?.userContracts.list
                          .find(
                            (contract) =>
                              contract.id === currentUserContract.value
                          )
                          ?.electricNumberInfos.map((info) => ({
                            label: info.number,
                            value: info.number,
                          })) ?? []
                      }
                      label={`電號`}
                      aria-label={`電號`}
                      placeholder={"請填入"}
                      required
                    />
                  )}
                />
              ) : null}
              <Controller
                control={control}
                name={`transferDocumentUsers.${index}.expectedYearlyPurchaseDegree`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`預計年採購度數（MWh）`}
                    aria-label={`預計年採購度數（MWh）`}
                    placeholder={"請填入"}
                  />
                )}
              />
              <Controller
                control={control}
                name={`transferDocumentUsers.${index}.monthlyTransferDegree`}
                render={({ field }) => (
                  <InputText
                    {...field}
                    label={`每月轉供度數（kWh）`}
                    aria-label={`每月轉供度數（kWh）`}
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
                    label={`年轉供度數（kWh）`}
                    aria-label={`年轉供度數（kWh）`}
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
                if (number > 0) {
                  setAddUserNumber(number);
                }
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
                  electricNumber: {
                    label: "",
                    value: "",
                  },
                  yearlyTransferDegree: 0,
                  expectedYearlyPurchaseDegree: 0,
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
          ) : (
            <EditTransferDocumentBtn
              transferDocumentId={currentModifyTransferDocument.id}
              handleSubmit={handleSubmit}
              onClose={onClose}
            />
          )}
        </Grid>
      </>

      {/* 刪除 Dialog */}
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
          open={deleteUserIndex !== -1}
          title={"刪除用戶"}
          content={"是否確認要刪除用戶？"}
          onConfirm={() => {
            userRemove(deleteUserIndex);
            setDeleteUserIndex(-1);
          }}
          onClose={() => {
            setDeleteUserIndex(-1);
          }}
        />
      ) : null}
    </Dialog>
  );
}

export default TransferDocumentDialog;
