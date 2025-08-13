import { Grid, Typography } from "@mui/material";
import { useState } from "react";
import { IconBtn } from "@components/Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import { TransferDocument } from "@core/graphql/types";
import { FieldsController } from "@components/Controller";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import dynamic from "next/dynamic";
import Dialog from "@components/Dialog";
import { FormData } from "./FormData";
import { useFieldArray, useForm } from "react-hook-form";
import {
  useFetchCompaniesAllData,
  useLazyUserContracts,
  useUsers,
} from "@utils/hooks/queries";
import EditTransferDocumentBtn from "@components/TransferDocument/TransferDocumentDialog/EditTransferDocumentBtn";
import PowerPlantsSection from "./PowerPlantsSection";
import UsersSection from "./UsersSection";
import { DialogErrorBoundary } from "@components/ErrorBoundary";

const DialogAlert = dynamic(() => import("@components/DialogAlert"));
const CreateTransferDocumentBtn = dynamic(
  () =>
    import(
      "@components/TransferDocument/TransferDocumentDialog/CreateTransferDocumentBtn"
    ),
  {
    loading: () => <div>Loading...</div>,
    ssr: false
  }
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
                label: u.userContract?.name,
                value: u.userContract?.id,
              },
              electricNumber: {
                label: u.electricNumberInfo?.number,
                value: u.electricNumberInfo?.number,
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
  const [isUsersLoadingMore, setIsUsersLoadingMore] = useState<boolean>(false);

  /** apis */
  const { data: usersData, fetchMore: usersFetchMore, loading: usersLoading } = useUsers({ onlyBasicInformation: true });
  const { data: companiesData } = useFetchCompaniesAllData();
  const [getUserContracts, { data: userContractsData }] =
    useLazyUserContracts();

  return (
    <Dialog open={isOpenDialog} onClose={onClose}>
      <DialogErrorBoundary onClose={onClose}>
        <Grid container justifyContent="space-between" alignItems="center">
          <Typography variant="h4" textAlign="left">
            {variant === "create" ? "新增轉供合約" : "修改轉供合約"}
          </Typography>
          <IconBtn icon={<HighlightOffIcon />} onClick={onClose} />
        </Grid>

        {/* 轉供資料區塊 */}
        <Typography variant="h5" textAlign="left">
          轉供資料
        </Typography>
        <FieldsController
          configs={transferDocumentInformationConfigs}
          form={{ control, errors }}
        />

        {/* 電廠 Section */}
        <PowerPlantsSection
          control={control}
          watch={watch}
          fields={transferDocumentPowerPlantsFields}
          append={append}
          remove={remove}
          companiesData={companiesData}
          addPowerPlantNumber={addPowerPlantNumber}
          setAddPowerPlantNumber={setAddPowerPlantNumber}
        />

        {/* 用戶 Section */}
        <UsersSection
          control={control}
          watch={watch}
          fields={transferDocumentUsersFields}
          append={userAppend}
          remove={userRemove}
          usersData={usersData}
          usersFetchMore={usersFetchMore}
          usersLoading={usersLoading}
          isUsersLoadingMore={isUsersLoadingMore}
          setIsUsersLoadingMore={setIsUsersLoadingMore}
          getUserContracts={getUserContracts}
          userContractsData={userContractsData}
          addUserNumber={addUserNumber}
          setAddUserNumber={setAddUserNumber}
        />

        <FieldsController configs={docConfigs} form={{ control, errors }} />

        {/* 按鈕區塊 */}
        <Grid
          container
          justifyContent="flex-start"
          alignItems="center"
          gap="10px"
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
      </DialogErrorBoundary>
    </Dialog>
  );
}

export default TransferDocumentDialog;
