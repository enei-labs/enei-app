import { FieldConfig } from "@core/types";

// 契約起始時間相關的額外欄位
export const contractStartTimeFields: FieldConfig[] = [
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
    required: false,
  },
  {
    type: "NUMBER",
    name: "salesPeriod",
    required: true,
    label: "賣電年限",
  },
  {
    type: "DATE",
    name: "transferAt",
    required: true,
    label: "預計開始轉供綠電日期",
  },
];

// 契約結束時間相關的額外欄位
export const contractEndTimeFields: FieldConfig[] = [
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
    required: true,
    label: "賣電年限",
  },
  {
    type: "DATE",
    name: "transferAt",
    required: true,
    label: "預計開始轉供綠電日期",
  },
];

// 轉供開始時間相關的額外欄位
export const contractTransferStartTimeFields: FieldConfig[] = [
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
    required: false,
  },
  {
    type: "NUMBER",
    name: "salesPeriod",
    required: true,
    label: "賣電年限",
  },
  {
    type: "DATE",
    name: "transferAt",
    required: true,
    label: "預計開始轉供綠電日期",
  },
]; 