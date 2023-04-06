import { ContractTimeType } from "@core/graphql/types";
import { FieldConfig } from "@core/types";
import { numberValidated, textValidated } from "@core/types/fieldConfig";

const contractTimeTypeMap = {
  [ContractTimeType.ContractEndTime]: "固定日期(填入合約結束日期)",
  [ContractTimeType.ContractStartTime]: "合約年限從合約起始日期起算",
  [ContractTimeType.TransferStartTime]: "合約年限從轉供起始日期起算",
};

const contractTimeTypeOptions = Object.values(ContractTimeType).map((o) => ({
  label: contractTimeTypeMap[o],
  value: o,
}));

export const fieldConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "companyName",
    label: "公司名稱",
    disabled: true,
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
  {
    type: "TEXT",
    name: "name",
    label: "合約名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "number",
    label: "合約編號",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "price",
    label: "合約價格（元/kWh）",
    required: true,
    validated: textValidated,
  },
  {
    type: "SINGLE_SELECT",
    name: "contractTimeType",
    label: "合約時間計算方式",
    required: true,
    options: contractTimeTypeOptions,
  },
  {
    type: "NUMBER",
    name: "duration",
    label: "合約年限（年）",
    required: true,
    validated: numberValidated,
  },
  {
    type: "DATE",
    name: "startedAt",
    label: "合約起始日期",
    required: true,
    validated: textValidated,
  },
  {
    type: "DATE",
    name: "endedAt",
    label: "合約結束日期",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "transferRate",
    label: "轉供率要求（%）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "daysToPay",
    label: "付款條件（天）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXTAREA",
    name: "description",
    label: "合約描述 / 特殊條件",
    required: false,
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