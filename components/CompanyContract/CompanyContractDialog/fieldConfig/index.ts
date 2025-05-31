import { ContractTimeType } from "@core/graphql/types";
import { FieldConfig } from "@core/types";
import { baseFieldConfigs } from "./baseFieldConfigs";
import {
  contractStartTimeFields,
  contractEndTimeFields,
  contractTransferStartTimeFields,
} from "./conditionalFields";

/**
 * 根據合約時間計算方式獲取對應的欄位配置
 */
export const getFieldConfigs = (contractTimeType?: ContractTimeType): FieldConfig[] => {
  if (!contractTimeType) {
    return baseFieldConfigs;
  }

  const conditionalFieldsMap = {
    [ContractTimeType.ContractStartTime]: contractStartTimeFields,
    [ContractTimeType.ContractEndTime]: contractEndTimeFields,
    [ContractTimeType.TransferStartTime]: contractTransferStartTimeFields,
  };

  const conditionalFields = conditionalFieldsMap[contractTimeType] || [];
  
  return [...baseFieldConfigs, ...conditionalFields];
};

// 也可以導出個別的配置以保持向後兼容
export { baseFieldConfigs } from "./baseFieldConfigs";
export {
  contractStartTimeFields,
  contractEndTimeFields,
  contractTransferStartTimeFields,
} from "./conditionalFields"; 