import { ContractTimeType } from "@core/graphql/types";
import { useEffect, useState } from "react";
import { addYears } from 'date-fns';
import { FieldConfig } from '@core/types';
import { getFieldConfigs } from "./index";

export const useCreateDisplayFieldConfigs = (
  values: {
    contractTimeType: ContractTimeType,
    salesPeriod?: number,
    salesAt?: Date,
  },
  setEndedAt?: (value: Date) => void,
) => {
  const { contractTimeType, salesPeriod, salesAt } = values;
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(() => 
    getFieldConfigs(contractTimeType)
  );

  useEffect(() => {
    const newFieldConfigs = getFieldConfigs(contractTimeType);
    setFieldConfigs(newFieldConfigs);
  }, [contractTimeType]);

  // Add useEffect to update endedAt when salesAt or duration changes
  useEffect(() => {
    if (!setEndedAt) return;
    if (contractTimeType === ContractTimeType.ContractStartTime && salesAt && salesPeriod) {
      const endDate = addYears(new Date(salesAt), Number(salesPeriod));
      setEndedAt(endDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractTimeType, salesAt, salesPeriod]);

  return fieldConfigs;
}