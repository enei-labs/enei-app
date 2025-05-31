import { ContractTimeType } from "@core/graphql/types";
import { useEffect, useState } from "react";
import { FieldConfig } from '@core/types';
import { getFieldConfigs } from "./index";

export const useEditDisplayFieldConfigs = (
  values: {
    contractTimeType: ContractTimeType,
  },
  setEndedAt?: (value: Date) => void,
) => {
  const { contractTimeType } = values;
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(() => 
    getFieldConfigs(contractTimeType)
  );

  useEffect(() => {
    const newFieldConfigs = getFieldConfigs(contractTimeType);
    setFieldConfigs(newFieldConfigs);
  }, [contractTimeType]);

  return fieldConfigs;
}