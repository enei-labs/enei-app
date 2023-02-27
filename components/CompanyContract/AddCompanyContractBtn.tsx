import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig, Option } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useReducer } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreateCompanyContract } from "@utils/hooks/mutations/useCreateCompanyContract";
import { Company } from "@core/graphql/types";
import { COMPANY_CONTRACTS } from "@core/graphql/queries/companyContracts";
import dynamic from "next/dynamic";

const EditConfirmDialog = dynamic(
  () => import("@components/EditConfirmDialog")
);

type FormData = {
  name: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  price: string;
  duration: string;
  startedAt: Date;
  endedAt: string;
  transferRate: string;
  daysToPay: string;
  description: string;
  contractDoc: string;
  transferDoc: string;
  industryDoc: string;
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
    name: "price",
    label: "合約價格（元/kWh）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "duration",
    label: "合約年限（年）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "startedAt",
    label: "合約起始日期",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
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
    validated: textValidated,
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
    }
  );

  const [createCompanyContract, { loading }] = useCreateCompanyContract();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    const { data } = await createCompanyContract({
      variables: {
        input: {
          companyId: company.id,
          name: formData.name,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
          price: formData.price,
          duration: formData.duration,
          startedAt: formData.startedAt,
          endedAt: formData.endedAt,
          transferRate: Number(formData.transferRate),
          daysToPay: Number(formData.daysToPay),
          description: formData.description,
          contractDoc: formData.contractDoc,
          transferDoc: formData.transferDoc,
          industryDoc: formData.industryDoc,
        },
      },
      refetchQueries: [COMPANY_CONTRACTS],
    });

    if (data?.createCompanyContract.__typename === "CompanyContract") {
      reset();
      dispatch({ showFormDialog: false, showEditConfirmDialog: true });
    }
  };

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
            發電業資訊
          </Typography>
          <IconBtn
            icon={<CloseIcon />}
            onClick={() => dispatch({ showEditConfirmDialog: true })}
          />
        </Grid>
        <FieldsController
          configs={configs.slice(0, 1)}
          form={{ control, errors }}
        />

        <Typography variant="h5">聯絡人資訊</Typography>
        <FieldsController
          configs={configs.slice(1, 4)}
          form={{ control, errors }}
        />

        <Typography variant="h5">合約資訊</Typography>
        <FieldsController
          configs={configs.slice(4, 11)}
          form={{ control, errors }}
        />

        <Typography variant="h5">相關文件</Typography>
        <FieldsController
          configs={configs.slice(11)}
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
            onClick={() => console.log("click")}
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
    </>
  );
};

export default AddCompanyContractBtn;
