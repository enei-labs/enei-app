import { useUpdateCompanyContract, useValidatedForm } from "@utils/hooks";
import { useMemo, useState } from "react";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import { CompanyContract } from "@core/graphql/types";
import dynamic from "next/dynamic";
import { fieldConfigs } from "@components/CompanyContract/CompanyContractDialog/fieldConfigs";
import { FormData } from "@components/CompanyContract/CompanyContractDialog/FormData";
import CompanyContractDialog from "@components/CompanyContract/CompanyContractDialog/CompanyContractDialog";
import { IconBtn } from "@components/Button";

const EditConfirmDialog = dynamic(
  () => import("@components/EditConfirmDialog")
);

interface CompanyContractProps {
  companyContract: CompanyContract;
}

const EditCompanyContractBtn = (props: CompanyContractProps) => {
  const { companyContract } = props;
  const [shownFormDialog, showFormDialog] = useState(false);
  const [shownEditConfirmDialog, showEditConfirmDialog] = useState(false);

  const [updateCompanyContract, { loading }] = useUpdateCompanyContract();

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(fieldConfigs, {
    /** @TODO 判斷 companyContractType */
    defaultValues: {
      companyName: companyContract.company.name,
      name: companyContract.name,
      number: companyContract.number,
      contactName: companyContract.contactName,
      contactEmail: companyContract.contactEmail,
      contactPhone: companyContract.contactPhone,
      price: companyContract.price,
      duration: companyContract.duration,
      startedAt: companyContract.startedAt,
      endedAt: companyContract.endedAt,
      transferRate: companyContract.transferRate,
      daysToPay: companyContract.daysToPay,
      description: companyContract.description,
      contractDoc: { id: companyContract.contractDoc, file: undefined },
      transferDoc: { id: companyContract.transferDoc, file: undefined },
      industryDoc: { id: companyContract.industryDoc, file: undefined },
    },
  });

  const onSubmit = async (formData: FormData) => {
    const { data } = await updateCompanyContract({
      variables: {
        input: {
          companyContractId: companyContract.id,
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
    });

    if (data?.updateCompanyContract.__typename === "CompanyContract") {
      showEditConfirmDialog(false);
      showFormDialog(false);
    }
  };

  const displayFieldConfigs = useMemo(() => {
    const contractTimeTypeIndex = fieldConfigs.findIndex(
      (c) => c.name === "contractTimeType"
    );
    return {
      name: fieldConfigs.slice(0, 1),
      contacts: fieldConfigs.slice(1, 4),
      docs: fieldConfigs.slice(14),
      contract: [fieldConfigs[contractTimeTypeIndex]],
    };
  }, []);

  return (
    <>
      <IconBtn
        icon={<BorderColorOutlined />}
        onClick={() => showFormDialog(true)}
      />

      {shownFormDialog ? (
        <CompanyContractDialog
          variant="edit"
          open={shownFormDialog}
          closeFn={() => showEditConfirmDialog(true)}
          submitFn={handleSubmit(onSubmit)}
          displayFieldConfigs={displayFieldConfigs}
          form={{ control, errors }}
          loading={loading}
        />
      ) : null}

      {shownEditConfirmDialog ? (
        <EditConfirmDialog
          onCloseAllDialog={() => {
            showEditConfirmDialog(false);
            showFormDialog(false);
          }}
          open={shownEditConfirmDialog}
          onClose={() => showEditConfirmDialog(false)}
          variant="edit"
        />
      ) : null}
    </>
  );
};

export default EditCompanyContractBtn;
