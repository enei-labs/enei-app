import { Typography } from "@mui/material";
import { FieldsController } from "@components/Controller";
import FieldConfig from "@core/types/fieldConfig";
import { useFormContext } from "react-hook-form";
import { FormData } from "@components/TPCBill/TPCBillDialog/FormData";

export default function DocumentFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();

  const docConfigs: FieldConfig[] = [
    {
      type: "FILE",
      name: "billDoc",
      label: "台電繳費單",
      required: true,
    },
  ];

  return (
    <>
      <Typography textAlign="left" variant="h5">
        相關文件
      </Typography>
      <FieldsController configs={docConfigs} form={{ control, errors }} />
    </>
  );
}
