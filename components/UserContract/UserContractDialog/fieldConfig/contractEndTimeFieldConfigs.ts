import { contractTimeTypeOptions } from "@components/UserContract/UserContractDialog/fieldConfig/contractTimeType";

import { FieldConfig } from "@core/types";
import { priceValidated } from "@core/types/fieldConfig";

export const contractEndTimeFieldConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    required: true,
    label: "契約名稱",
  },
  {
    type: "TEXT",
    name: "serialNumber",
    required: true,
    label: "契約編號",
  },
  {
    type: "NUMBER",
    name: "price",
    required: true,
    label: "採購電價（元/kWh）",
    validated: priceValidated,
  },
  {
    type: "NUMBER",
    name: "purchaseDegree",
    required: true,
    label: "契約總預計年採購度數（kWh）",
  },
  {
    type: "NUMBER",
    name: "upperLimit",
    label: "預計最高採購上限（契約）（kWh）",
  },
  {
    type: "NUMBER",
    name: "lowerLimit",
    label: "預計最低採購下限（契約）（kWh）",
  },
  {
    type: "SINGLE_SELECT",
    name: "contractTimeType",
    label: "契約時間計算方式",
    required: true,
    disabled: false,
    options: contractTimeTypeOptions,
  },
  {
    type: "DATE",
    name: "salesAt",
    required: true,
    label: "契約起始日期",
  },
  {
    type: "DATE",
    name: "salesTo",
    label: "契約結束日期",
    required: true,
    disabled: false,
  },
  {
    type: "NUMBER",
    name: "salesPeriod",
    required: false,
    label: "賣電年限",
  },
  {
    type: "DATE",
    name: "transferAt",
    required: true,
    label: "預計開始轉供綠電日期",
  },
];
