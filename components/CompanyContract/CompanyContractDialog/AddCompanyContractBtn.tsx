import Dialog from "@components/Dialog";
import { Box, Button, Typography } from "@mui/material";
import { useValidatedForm } from "@utils/hooks";
import { useReducer } from "react";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { useCreateCompanyContract } from "@utils/hooks/mutations/useCreateCompanyContract";
import {
  Company,
  CompanyContract,
  ContractTimeType,
} from "@core/graphql/types";
import { COMPANY_CONTRACTS } from "@core/graphql/queries/companyContracts";
import dynamic from "next/dynamic";
import {
  fieldConfigs,
  useDisplayFieldConfigs,
} from "@components/CompanyContract/CompanyContractDialog/fieldConfigs";
import { FormData } from "@components/CompanyContract/CompanyContractDialog/FormData";
import { toast } from "react-toastify";

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
    setValue,
  } = useValidatedForm<FormData>(fieldConfigs, {
    defaultValues: { companyName: company?.name },
  });

  const contractTimeType = watch("contractTimeType");
  const rateType = watch("rateType");
  const duration = watch("duration");
  const startedAt = watch("startedAt");
  const setEndedAt = (value: Date) => setValue("endedAt", value);

  const onSubmit = async (formData: FormData) => {
    if (
      formData.contractTimeType.value === ContractTimeType.TransferStartTime
    ) {
      formData.endedAt = undefined;
    }

    if (formData.contractDoc) {
      toast.error("購電合約文件未上傳");
    }
    if (formData.transferDoc) {
      toast.error("轉供所需資料文件未上傳");
    }
    if (formData.industryDoc) {
      toast.error("電業佐證資料文件未上傳");
    }

    const { data } = await createCompanyContract({
      variables: {
        input: {
          companyId: company?.id ?? "",
          name: formData.name,
          number: formData.number,
          rateType: formData.rateType,
          price: formData.price || undefined,
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
      onCompleted: () => toast.success("新增成功！"),
    });

    if (data?.createCompanyContract.__typename === "CompanyContract") {
      reset();
      createSuccessCallback();
    }
  };

  const displayFieldConfigs = useDisplayFieldConfigs(
    {
      contractTimeType: contractTimeType?.value,
      rateType: rateType,
      duration: Number(duration),
      startedAt: startedAt,
    },
    "create",
    setEndedAt
  );

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
    useCreateCompanyContractSubmitFn(company, () => {
      dispatch({ showFormDialog: false, showEditConfirmDialog: false });
    });

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
          companyContract={state.companyContract}
          companyContractId={state.companyContract.id}
        />
      ) : null}
    </>
  );
};

export default AddCompanyContractBtn;
