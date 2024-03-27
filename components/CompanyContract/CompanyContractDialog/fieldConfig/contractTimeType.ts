import { ContractTimeType } from "@core/graphql/types";

export const contractTimeTypeMap = {
  [ContractTimeType.ContractEndTime]: "固定日期(填入合約結束日期)",
  [ContractTimeType.ContractStartTime]: "合約年限從合約起始日期起算",
  [ContractTimeType.TransferStartTime]: "合約年限從轉供起始日期起算",
};

export const contractTimeTypeOptions = Object.values(ContractTimeType).map((o) => ({
  label: contractTimeTypeMap[o],
  value: o,
}));