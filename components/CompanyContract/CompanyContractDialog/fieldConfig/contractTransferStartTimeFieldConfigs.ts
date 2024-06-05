import { contractTimeTypeOptions } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/contractTimeType";
import { RateType } from "@core/graphql/types";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";

export const contractTransferStartTimeFieldConfigs: FieldConfig[] = [
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
    type: "RADIO",
    name: "rateType",
    label: "費率計算方式",
    radios: [
      {
        label: "單一費率",
        value: RateType.Single,
      },
      {
        label: "個別費率",
        value: RateType.Individual,
      },
    ],
    required: true,
  },
  {
    type: "TEXT",
    name: "price",
    label: "合約價格（元/kWh）",
    required: false,
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
    type: "TEXT",
    name: "duration",
    label: "合約年限（年）",
    required: false,
  },
  {
    type: "DATE",
    name: "startedAt",
    label: "合約起始日期",
    required: true,
  },
  {
    type: "DATE",
    name: "endedAt",
    label: "合約結束日期",
    required: false,
  },
  {
    type: "TEXT",
    name: "transferRate",
    label: "轉供率要求（%）",
    required: true,
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
];