import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
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
import { Company, CompanyType } from "@core/graphql/types";
import { companyFieldConfigs, useCompanyDisplayConfigs } from "./companyFieldConfigs";

type FormData = {
  type: CompanyType;
  name: string;
  taxId: string;
  contactName: string;
  contactEmails: string;
  contactPhone: string;
};

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
    watch,
    formState: { errors },
  } = useValidatedForm<FormData>(companyFieldConfigs, {
    defaultValues: { type: CompanyType.Company },
  });

  const typeValue = watch("type");
  const displayConfigs = useCompanyDisplayConfigs(typeValue);

  const onSubmit = async (formData: FormData) => {
    const { data } = await createCompany({
      variables: {
        input: {
          type: formData.type,
          name: formData.name,
          taxId: formData.taxId,
          contactName: formData.contactName,
          contactEmails: formData.contactEmails.split(/[,，]\s*/).map((e: string) => e.trim()).filter(Boolean),
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
            {typeValue === CompanyType.Individual ? "基本資訊" : "公司資訊"}
          </Typography>
          <IconBtn
            icon={<CloseIcon />}
            onClick={() => dispatch({ form: false })}
          />
        </Grid>
        <FieldsController
          configs={displayConfigs.slice(0, 3)}
          form={{ control, errors }}
        />

        <Typography variant="h5">聯絡人資訊</Typography>
        <FieldsController
          configs={displayConfigs.slice(3)}
          form={{ control, errors }}
        />

        <LoadingButton
          startIcon={<AddIcon />}
          variant="contained"
          loading={loading}
          onClick={handleSubmit(onSubmit)}
        >
          儲存
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
