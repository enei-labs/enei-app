import { FieldsController } from "@components/Controller";
import FieldConfig, { textValidated } from "@core/types/fieldConfig";
import { useFormContext } from "react-hook-form";
import { FormData } from "@components/TPCBill/TPCBillDialog/FormData";

export default function BasicInfoFields() {
  const {
    control,
    formState: { errors },
  } = useFormContext<FormData>();
  const basicInfoConfigs: FieldConfig[] = [
    {
      type: "TEXT",
      name: "billNumber",
      label: "台電繳費單編號",
      placeholder: "請填入",
      validated: textValidated,
      required: true,
    },
    {
      type: "DATE",
      name: "billReceivedDate",
      label: "收到台電繳費單日期",
      placeholder: "請填入",
      validated: textValidated,
      required: true,
    },
    {
      type: "DATE_MONTH",
      name: "billingDate",
      label: "計費年月",
      placeholder: "請填入",
      validated: textValidated,
      required: true,
    },
  ];

  return (
    <FieldsController configs={basicInfoConfigs} form={{ control, errors }} />
  );
}
