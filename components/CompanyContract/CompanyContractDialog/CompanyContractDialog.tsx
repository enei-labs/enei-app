import { FieldsController } from "@components/Controller";
import Dialog from "@components/Dialog";
import { FieldConfig } from "@core/types";
import { LoadingButton } from "@mui/lab";
import { Grid, Typography } from "@mui/material";
import AddIcon from "@mui/icons-material/AddCircleOutlineOutlined";
import CloseIcon from "@mui/icons-material/HighlightOff";
import { IconBtn } from "@components/Button";
import { Form } from "@core/types/fieldController";
import { InputText } from "@components/Input";

interface CompanyContractProps {
  variant: "edit" | "create";
  open: boolean;
  companyName: string;
  closeFn: VoidFunction;
  submitFn: any;
  displayFieldConfigs: {
    name: FieldConfig[];
    contacts: FieldConfig[];
    docs: FieldConfig[];
    contract: FieldConfig[];
  };
  form: Form;
  loading: boolean;
}

const CompanyContractDialog = (props: CompanyContractProps) => {
  const {
    variant,
    open,
    closeFn,
    submitFn,
    displayFieldConfigs,
    form,
    loading,
    companyName,
  } = props;

  return (
    <Dialog key="form" open={open} onClose={closeFn}>
      <Grid container justifyContent={"space-between"} alignItems={"center"}>
        <Typography variant="h4" textAlign={"left"}>
          {variant === "create" ? "新增合約" : "編輯合約"}
        </Typography>
        <IconBtn icon={<CloseIcon />} onClick={closeFn} />
      </Grid>
      <Typography textAlign="left" variant="h5">
        發電業資訊
      </Typography>
      {/** work-around about display correct company name */}
      <InputText label="公司名稱" value={companyName} disabled />
      {/* <FieldsController configs={displayFieldConfigs.name} form={form} /> */}

      <Typography textAlign="left" variant="h5">
        聯絡人資訊
      </Typography>
      <FieldsController configs={displayFieldConfigs.contacts} form={form} />

      <Typography textAlign="left" variant="h5">
        合約資訊
      </Typography>
      <FieldsController configs={displayFieldConfigs.contract} form={form} />

      <Typography textAlign="left" variant="h5">
        相關文件
      </Typography>
      <FieldsController configs={displayFieldConfigs.docs} form={form} />

      <LoadingButton
        startIcon={<AddIcon />}
        variant="contained"
        loading={loading}
        onClick={submitFn}
      >
        {variant === "create" ? "新增" : "儲存"}
      </LoadingButton>
    </Dialog>
  );
};

export default CompanyContractDialog;
