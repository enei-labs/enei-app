import Dialog from "@components/Dialog";
import { Box, Button, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useReducer } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreateCompanyContract } from "@utils/hooks/mutations/useCreateCompanyContract";
import { Company, CompanyContract } from "@core/graphql/types";
import { COMPANY_CONTRACTS } from "@core/graphql/queries/companyContracts";
import dynamic from "next/dynamic";
import {
  fieldConfigs,
  useDisplayFieldConfigs,
} from "@components/CompanyContract/CompanyContractDialog/fieldConfigs";
import { FormData } from "@components/CompanyContract/CompanyContractDialog/FormData";

const EditConfirmDialog = dynamic(
  () => import("@components/EditConfirmDialog")
);

const PowerPlantDialog = dynamic(
  () => import("@components/PowerPlant/PowerPlantDialog")
);

const CompanyContractDialog = dynamic(
  () =>
    import(
      "@components/CompanyContract/CompanyContractDialog/CompanyContractDialog"
    )
);

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

export const useCreateCompanyContractSubmitFn = (
  company: Company | null,
  createSuccessCallback: VoidFunction
) => {
  const [createCompanyContract, { loading }] = useCreateCompanyContract();

  const {
    reset,
    control,
    handleSubmit,
    formState: { errors },
    watch,
  } = useValidatedForm<FormData>(fieldConfigs, {
    defaultValues: { companyName: company?.name },
  });
  const contractTimeType = watch("contractTimeType");

  const onSubmit = async (formData: FormData) => {
    const { data } = await createCompanyContract({
      variables: {
        input: {
          companyId: company?.id ?? "",
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
      createSuccessCallback();
    }
  };

  const displayFieldConfigs = useDisplayFieldConfigs(contractTimeType?.value);

  return {
    displayFieldConfigs,
    submitFn: handleSubmit(onSubmit),
    loading,
    form: {
      control,
      errors,
    },
  };
};

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

  const { displayFieldConfigs, submitFn, loading, form } =
    useCreateCompanyContractSubmitFn(company, () =>
      dispatch({ showFormDialog: false, showEditConfirmDialog: false })
    );

  return (
    <>
      <Button
        startIcon={<AddIcon />}
        onClick={() => dispatch({ showFormDialog: true })}
      >
        新增合約
      </Button>

      {!!state.showFormDialog ? (
        <CompanyContractDialog
          variant="create"
          open={!!state.showFormDialog}
          closeFn={() => dispatch({ showEditConfirmDialog: true })}
          submitFn={submitFn}
          displayFieldConfigs={displayFieldConfigs}
          form={form}
          loading={loading}
          companyName={company.name}
        />
      ) : null}

      <Dialog
        key="next"
        open={!!state.showNextDialog}
        onClose={() => dispatch({ showNextDialog: false })}
      >
        <Typography variant="h5">新增合約完成</Typography>

        <Typography variant="h5">已新增合約，是否立刻新增電廠？</Typography>

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
