import { useUpdateCompanyContract, useValidatedForm } from "@utils/hooks";
import { useState } from "react";
import BorderColorOutlined from "@mui/icons-material/BorderColorOutlined";
import { CompanyContract } from "@core/graphql/types";
import dynamic from "next/dynamic";
import {
  contractTimeTypeMap,
  fieldConfigs,
  useDisplayFieldConfigs,
} from "@components/CompanyContract/CompanyContractDialog/fieldConfigs";
import { FormData } from "@components/CompanyContract/CompanyContractDialog/FormData";
import CompanyContractDialog from "@components/CompanyContract/CompanyContractDialog/CompanyContractDialog";
import { IconBtn } from "@components/Button";
import { toast } from "react-toastify";

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
    watch,
  } = useValidatedForm<FormData>(fieldConfigs, {
    defaultValues: {
      contractTimeType: {
        label: contractTimeTypeMap[companyContract.contractTimeType],
        value: companyContract.contractTimeType,
      },
      companyName: companyContract.company.name,
      name: companyContract.name,
      number: companyContract.number,
      rateType: companyContract.rateType,
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
  const contractTimeType = watch("contractTimeType");
  const duration = watch("duration");
  const startedAt = watch("startedAt");

  const onSubmit = async (formData: FormData) => {
    if (!formData.contractDoc?.id) {
      toast.error("購電合約文件未上傳");
      return;
    }
    if (!formData.transferDoc?.id) {
      toast.error("轉供所需資料文件未上傳");
      return;
    }
    if (!formData.industryDoc?.id) {
      toast.error("電業佐證資料文件未上傳");
      return;
    }

    const { data } = await updateCompanyContract({
      variables: {
        input: {
          companyContractId: companyContract.id,
          name: formData.name,
          number: formData.number,
          price: formData.price || undefined,
          contractTimeType: formData.contractTimeType.value,
          duration: formData.duration,
          startedAt: formData.startedAt,
          endedAt: formData.endedAt,
          transferRate: Number(formData.transferRate),
          daysToPay: Number(formData.daysToPay),
          description: formData.description,
          contractDoc: formData.contractDoc?.id,
          transferDoc: formData.transferDoc?.id,
          industryDoc: formData.industryDoc?.id,
        },
      },
      onCompleted: () => toast.success("更新成功！"),
    });

    if (data?.updateCompanyContract.__typename === "CompanyContract") {
      showEditConfirmDialog(false);
      showFormDialog(false);
    }
  };

  const displayFieldConfigs = useDisplayFieldConfigs(
    {
      contractTimeType: contractTimeType?.value,
      rateType: companyContract.rateType,
      duration: Number(duration),
      startedAt,
    },
    "edit"
  );

  return (
    <>
      <IconBtn
        icon={<BorderColorOutlined />}
        onClick={() => showFormDialog(true)}
      />

      {shownFormDialog ? (
        <CompanyContractDialog
          companyName={companyContract.company.name}
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
