import { FieldConfig } from "@core/types";

// 合約起始時間相關的額外欄位
export const contractStartTimeFields: FieldConfig[] = [
  {
    type: "TEXT",
    name: "duration",
    label: "合約年限（年）",
    required: true,
  },
  {
    type: "DATE",
    name: "startedAt",
    label: "合約起始日期",
    required: true,
  },
  // Note: endedAt is commented out in the original for this type
];

// 合約結束時間相關的額外欄位
export const contractEndTimeFields: FieldConfig[] = [
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
    required: true,
    disabled: false,
  },
];

// 轉供開始時間相關的額外欄位
export const contractTransferStartTimeFields: FieldConfig[] = [
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
]; 