import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { useAuth } from "@core/context/auth";
import { FieldConfig, Option } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useReducer } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useCreateCompany } from "@utils/hooks/mutations/useCreateCompany";
import { COMPANIES } from "@core/graphql/queries/companies";
import { IconBtn } from "../Button";
import HighlightOffIcon from "@mui/icons-material/HighlightOff";
import UploadDocBox from "../UploadDocBox";

type FormData = {
  name: string;
  taxId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
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
  form?: boolean;
  next?: boolean;
};

const AddCompanyContractBtn = () => {
  const { me } = useAuth();
  const [state, dispatch] = useReducer(
    (prev: DialogState, next: DialogState) => {
      return { ...prev, ...next };
    },
    { form: false, next: false }
  );

  const [createCompany, { loading }] = useCreateCompany();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs);

  const onSubmit = async (formData: FormData) => {
    const { data } = await createCompany({
      variables: {
        input: {
          name: formData.name,
          taxId: formData.taxId,
          contactName: formData.contactName,
          contactEmail: formData.contactEmail,
          contactPhone: formData.contactPhone,
        },
      },
      refetchQueries: [COMPANIES],
    });

    if (data?.createCompany.__typename === "Company") {
      reset();
      dispatch({ form: false, next: true });
    }
  };

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => dispatch({ form: true })}>
        新增合約
      </Button>

      <Dialog
        key="form"
        open={!!state.form}
        onClose={() => dispatch({ form: false })}
      >
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            發電業資訊
          </Typography>
          <IconBtn
            icon={<HighlightOffIcon />}
            onClick={() => dispatch({ form: false })}
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
        open={!!state.next}
        onClose={() => dispatch({ next: false })}
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
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => dispatch({ next: false })}
          >
            取消
          </Button>
        </Box>
      </Dialog>
    </>
  );
};

export default AddCompanyContractBtn;
