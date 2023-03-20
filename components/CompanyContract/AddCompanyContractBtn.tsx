import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig, Option } from "@core/types";
import { numberValidated, textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useMemo, useReducer } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreateCompanyContract } from "@utils/hooks/mutations/useCreateCompanyContract";
import {
  Company,
  CompanyContract,
  ContractTimeType,
} from "@core/graphql/types";
import { COMPANY_CONTRACTS } from "@core/graphql/queries/companyContracts";
import dynamic from "next/dynamic";

const EditConfirmDialog = dynamic(
  () => import("@components/EditConfirmDialog")
);

const PowerPlantDialog = dynamic(
  () => import("@components/PowerPlant/PowerPlantDialog")
);

const contractTimeTypeMap = {
  [ContractTimeType.ContractEndTime]: "固定日期(填入合約結束日期)",
  [ContractTimeType.ContractStartTime]: "合約年限從合約起始日期起算",
  [ContractTimeType.TransferStartTime]: "合約年限從轉供起始日期起算",
};

const contractTimeTypeOptions = Object.values(ContractTimeType).map((o) => ({
  label: contractTimeTypeMap[o],
  value: o,
}));

type FormData = {
  companyName: string;
  name: string;
  number: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  price: string;
  contractTimeType: {
    label: string;
    value: ContractTimeType;
  };
  duration?: string;
  startedAt: Date;
  endedAt?: string;
  transferRate: string;
  daysToPay: string;
  description: string;
  contractDoc: { id: string; file: File };
  transferDoc: { id: string; file: File };
  industryDoc: { id: string; file: File };
};

const configs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "companyName",
    label: "公司名稱",
    disabled: true,
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
    validated: textValidated.email(),
  },
  {
    type: "TEXT",
    name: "name",
    label: "合約名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "number",
    label: "合約編號",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "price",
    label: "合約價格（元/kWh）",
    required: true,
    validated: textValidated,
  },
  {
    type: "SINGLE_SELECT",
    name: "contractTimeType",
    label: "合約時間計算方式",
    required: true,
    options: contractTimeTypeOptions,
  },
  {
    type: "NUMBER",
    name: "duration",
    label: "合約年限（年）",
    required: true,
    validated: numberValidated,
  },
  {
    type: "DATE",
    name: "startedAt",
    label: "合約起始日期",
    required: true,
    validated: textValidated,
  },
  {
    type: "DATE",
    name: "endedAt",
    label: "合約結束日期",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "transferRate",
    label: "轉供率要求（%）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "daysToPay",
    label: "付款條件（天）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXTAREA",
    name: "description",
    label: "合約描述 / 特殊條件",
    required: false,
  },
  {
    type: "FILE",
    name: "contractDoc",
    required: true,
    label: "購電合約",
  },
  {
    type: "FILE",
    name: "industryDoc",
    required: true,
    label: "電業佐證資料",
  },
  {
    type: "FILE",
    name: "transferDoc",
    required: true,
    label: "轉供所需資料",
  },
];

type DialogState = {
  showFormDialog?: boolean;
  showNextDialog?: boolean;
  showEditConfirmDialog?: boolean;
  showPowerPlantDialog?: boolean;
  companyContract?: CompanyContract | null;
};

interface CompanyContractProps {
  company: Company;
}

const AddCompanyContractBtn = (props: CompanyContractProps) => {
  const { company } = props;
  const [state, dispatch] = useReducer(
    (prev: DialogState, next: DialogState) => {
      return { ...prev, ...next };
    },
    {
      showFormDialog: false,
      showNextDialog: false,
      showEditConfirmDialog: false,
      showPowerPlantDialog: false,
      companyContract: null,
    }
  );

  const [createCompanyContract, { loading }] = useCreateCompanyContract();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useValidatedForm<FormData>(configs, {
    defaultValues: { companyName: company.name },
  });
  const contractTimeType = watch("contractTimeType");

  const onSubmit = async (formData: FormData) => {
    const { data } = await createCompanyContract({
      variables: {
        input: {
          companyId: company.id,
          name: formData.name,
          number: formData.number,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          price: formData.price,
          contractTimeType: formData.contractTimeType.value,
          duration: formData.duration,
          startedAt: formData.startedAt,
          endedAt: formData.endedAt,
          transferRate: Number(formData.transferRate),
          daysToPay: Number(formData.daysToPay),
          description: formData.description,
          contractDoc: formData.contractDoc.id,
          transferDoc: formData.transferDoc.id,
          industryDoc: formData.industryDoc.id,
        },
      },
      refetchQueries: [COMPANY_CONTRACTS],
    });

    if (data?.createCompanyContract.__typename === "CompanyContract") {
      reset();
      dispatch({ showFormDialog: false, showEditConfirmDialog: false });
    }
  };

  const displayFieldConfigs = useMemo(() => {
    const contractTimeTypeIndex = configs.findIndex(
      (c) => c.name === "contractTimeType"
    );
    const baseConfigs = {
      name: configs.slice(0, 1),
      contacts: configs.slice(1, 4),
      docs: configs.slice(14),
      contract: [configs[contractTimeTypeIndex]],
    };
    const durationIndex = configs.findIndex((c) => c.name === "duration");
    const endAtIndex = configs.findIndex((c) => c.name === "endedAt");
    if (!contractTimeType) return baseConfigs;
    switch (contractTimeType.value) {
      case ContractTimeType.ContractEndTime:
        return {
          ...baseConfigs,
          contract: [
            ...configs.slice(4, durationIndex),
            ...configs.slice(durationIndex, 13),
          ],
        };
      case ContractTimeType.ContractStartTime:
        return {
          ...baseConfigs,
          contract: [
            ...configs.slice(4, endAtIndex),
            ...configs.slice(endAtIndex, 13),
          ],
        };
      case ContractTimeType.TransferStartTime:
        return {
          ...baseConfigs,
          contract: [
            ...configs.slice(4, endAtIndex),
            ...configs.slice(endAtIndex, 13),
          ],
        };
      default:
        return baseConfigs;
    }
  }, [contractTimeType]);

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        onClick={() => dispatch({ showFormDialog: true })}
      >
        新增合約
      </Button>

      <Dialog
        key="form"
        open={!!state.showFormDialog}
        onClose={() => dispatch({ showEditConfirmDialog: true })}
      >
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            新增合約
          </Typography>
          <IconBtn
            icon={<CloseIcon />}
            onClick={() => dispatch({ showEditConfirmDialog: true })}
          />
        </Grid>
        <Typography textAlign="left" variant="h5">
          發電業資訊
        </Typography>
        <FieldsController
          configs={displayFieldConfigs.name}
          form={{ control, errors }}
        />

        <Typography textAlign="left" variant="h5">
          聯絡人資訊
        </Typography>
        <FieldsController
          configs={displayFieldConfigs.contacts}
          form={{ control, errors }}
        />

        <Typography textAlign="left" variant="h5">
          合約資訊
        </Typography>
        <FieldsController
          configs={displayFieldConfigs.contract}
          form={{ control, errors }}
        />

        <Typography textAlign="left" variant="h5">
          相關文件
        </Typography>
        <FieldsController
          configs={displayFieldConfigs.docs}
          form={{ control, errors }}
        />

        <LoadingButton
          startIcon={<AddIcon />}
          variant="contained"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          新增
        </LoadingButton>
      </Dialog>

      <Dialog
        key="next"
        open={!!state.showNextDialog}
        onClose={() => dispatch({ showNextDialog: false })}
      >
        <Typography variant="h5">新增合約完成</Typography>

        <Typography variant="h5">已新增發電業，是否立刻新增電廠？</Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() =>
              dispatch({ showPowerPlantDialog: true, showNextDialog: false })
            }
          >
            新增
          </Button>
          <Button
            startIcon={<CloseIcon />}
            variant="outlined"
            onClick={() => dispatch({ showNextDialog: false })}
          >
            取消
          </Button>
        </Box>
      </Dialog>

      {state.showEditConfirmDialog ? (
        <EditConfirmDialog
          onCloseAllDialog={() =>
            dispatch({
              showEditConfirmDialog: false,
              showFormDialog: false,
              showNextDialog: false,
            })
          }
          open={state.showEditConfirmDialog}
          onClose={() => dispatch({ showEditConfirmDialog: false })}
          variant="create"
        />
      ) : null}

      {state.showPowerPlantDialog && state.companyContract ? (
        <PowerPlantDialog
          open={state.showPowerPlantDialog}
          onClose={() => {
            dispatch({ showPowerPlantDialog: false });
          }}
          variant="create"
          companyContractId={state.companyContract.id}
        />
      ) : null}
    </>
  );
};

export default AddCompanyContractBtn;
