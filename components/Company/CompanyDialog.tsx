import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import {
  useCreateOrUpdate,
  useUpdateCompany,
  useValidatedForm,
} from "@utils/hooks";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import { IconBtn } from "../Button";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { toast } from "react-toastify";
import { Company } from "@core/graphql/types";
import { useCreateCompany } from "@utils/hooks/mutations/useCreateCompany";
import { COMPANIES } from "@core/graphql/queries";

type FormData = {
  name: string;
  taxId: string;
  contactName: string;
  contactEmail: string;
  contactPhone: string;
  recipientAccounts: {
    bankCode: string;
    bankBranchCode: string;
    accountName: string;
    account: string;
  }[];
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
];

interface CompanyDialogProps {
  open: boolean;
  variant: "edit" | "create";
  onClose: VoidFunction;
  defaultValues?: Company;
}

const CompanyDialog = (props: CompanyDialogProps) => {
  const { open, onClose, variant, defaultValues } = props;

  const [createCompany, updateCompany, loading] = useCreateOrUpdate(
    variant,
    useCreateCompany,
    useUpdateCompany
  );

  const {
    control,
    handleSubmit,
    formState: { errors },
  } = useValidatedForm<FormData>(configs, {
    defaultValues,
  });

  const onSubmit = async (formData: FormData) => {
    if (variant === "create") {
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
    }

    if (variant === "edit" && defaultValues) {
      await updateCompany({
        variables: {
          input: {
            companyId: defaultValues.id,
            name: formData.name,
            taxId: formData.taxId,
            contactName: formData.contactName,
            contactEmail: formData.contactEmail,
            contactPhone: formData.contactPhone,
            recipientAccounts: formData.recipientAccounts,
          },
        },
        onCompleted: () => {
          toast.success("更新成功");
          onClose();
        },
      });
    }
  };

  return (
    <Dialog key="form" open={open} onClose={onClose}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          公司資訊
        </Typography>
        <IconBtn icon={<CloseIcon />} onClick={onClose} />
      </Grid>
      <FieldsController
        configs={configs.slice(0, 2)}
        form={{ control, errors }}
      />

      <Typography variant="h5">聯絡人資訊</Typography>
      <FieldsController configs={configs.slice(2)} form={{ control, errors }} />

      <LoadingButton
        startIcon={<AddIcon />}
        variant="contained"
        loading={loading}
        onClick={handleSubmit(onSubmit)}
      >
        {variant === "edit" ? "更新" : "新增"}
      </LoadingButton>
    </Dialog>
  );
};

export default CompanyDialog;
