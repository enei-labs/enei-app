import { contractTimeTypeOptions } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/contractTimeType";
import { FieldConfig } from "@core/types";

export const baseFieldConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "companyName",
    label: "公司名稱",
    disabled: true,
  },
  {
    type: "SINGLE_SELECT",
    name: "contractTimeType",
    label: "合約時間計算方式",
    required: true,
    disabled: false,
    options: contractTimeTypeOptions,
  },
  {
    type: "FILE",
    name: "contractDoc",
    required: true,
    label: "購電合約",
  },
  {
    type: "FILE",
    name: "industryDoc",
    required: true,
    label: "電業佐證資料",
  },
  {
    type: "FILE",
    name: "transferDoc",
    required: true,
    label: "轉供所需資料",
  },
];