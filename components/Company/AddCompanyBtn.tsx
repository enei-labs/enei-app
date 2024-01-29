import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { taiwanUBNValidation, textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Box, Button, Grid, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useReducer, useState } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { useCreateCompany } from "@utils/hooks/mutations/useCreateCompany";
import { COMPANIES } from "@core/graphql/queries/companies";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import CompanyContractDialog from "@components/CompanyContract/CompanyContractDialog/CompanyContractDialog";
import { useCreateCompanyContractSubmitFn } from "@components/CompanyContract";
import { Company } from "@core/graphql/types";

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
    name: "taxId",
    label: "統一編號",
    required: true,
    validated: taiwanUBNValidation,
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
    validated: textValidated.email("請輸入有效的電子郵件地址"),
  },
];

type DialogState = {
  form?: boolean;
  next?: boolean;
  showContractDialog?: boolean;
};

const AddCompanyBtn = () => {
  const [state, dispatch] = useReducer(
    (prev: DialogState, next: DialogState) => {
      return { ...prev, ...next };
    },
    { form: false, next: false }
  );
  const [company, setCompany] = useState<Company | null>(null);

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
      setCompany(data.createCompany);
    }
  };

  const {
    displayFieldConfigs,
    submitFn,
    loading: createCompanyContractLoading,
    form,
  } = useCreateCompanyContractSubmitFn(company, () => {
    dispatch({ showContractDialog: false });
  });

  return (
    <>
      <Button startIcon={<AddIcon />} onClick={() => dispatch({ form: true })}>
        新增發電業
      </Button>

      <Dialog
        key="form"
        open={!!state.form}
        onClose={() => dispatch({ form: false })}
      >
        <Grid container justifyContent={"space-between"} alignItems={"center"}>
          <Typography variant="h4" textAlign={"left"}>
            公司資訊
          </Typography>
          <IconBtn
            icon={<CloseIcon />}
            onClick={() => dispatch({ form: false })}
          />
        </Grid>
        <FieldsController
          configs={configs.slice(0, 2)}
          form={{ control, errors }}
        />

        <Typography variant="h5">聯絡人資訊</Typography>
        <FieldsController
          configs={configs.slice(2)}
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
        <Typography variant="h5">新增發電業完成</Typography>

        <Typography variant="h5">已新增發電業， 是否立刻新增合約？</Typography>

        <Box sx={{ display: "flex", justifyContent: "center", gap: "8px" }}>
          <Button
            startIcon={<AddIcon />}
            variant="contained"
            onClick={() => dispatch({ next: false, showContractDialog: true })}
          >
            新增
          </Button>
          <Button
            startIcon={<CloseIcon />}
            variant="outlined"
            onClick={() => dispatch({ next: false })}
          >
            取消
          </Button>
        </Box>
      </Dialog>

      {!!state.showContractDialog && company ? (
        <CompanyContractDialog
          variant="create"
          open={!!state.showContractDialog}
          closeFn={() => dispatch({ showContractDialog: false })}
          submitFn={submitFn}
          displayFieldConfigs={displayFieldConfigs}
          form={form}
          loading={createCompanyContractLoading}
          companyName={company.name}
        />
      ) : null}
    </>
  );
};

export default AddCompanyBtn;
