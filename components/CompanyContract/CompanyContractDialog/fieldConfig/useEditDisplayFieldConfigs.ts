import { ContractTimeType, RateType } from "@core/graphql/types";
import { useEffect, useMemo } from "react";
import { addYears } from 'date-fns';
import { getFieldConfigs } from "./index";
import { baseFieldConfigs } from "./baseFieldConfigs";

export const useEditDisplayFieldConfigs = (
  values: {
    contractTimeType: ContractTimeType,
    rateType?: RateType,
    duration?: number,
    startedAt?: Date,
  },
  setEndedAt?: (value: Date) => void,
  ) => {
  const { contractTimeType, rateType, duration, startedAt } = values;

  const displayFieldConfigs = useMemo(() => {
    const baseConfigs = {
      name: [baseFieldConfigs[0]],
      contract: [baseFieldConfigs[1]],
      docs: baseFieldConfigs.slice(-3), // Last 3 items are the file configs
    };

    if (!contractTimeType) return baseConfigs;

    let fieldConfigs = getFieldConfigs(contractTimeType);

    if (rateType === RateType.Individual) {
      fieldConfigs = fieldConfigs.filter(field => field.name !== 'price');
    }

    return {
      ...baseConfigs,
      contract: fieldConfigs,
    };
  }, [contractTimeType, rateType]);

  // Add useEffect to update endedAt when startedAt or duration changes
  useEffect(() => {
    if (!setEndedAt) return;
    if (contractTimeType === ContractTimeType.ContractStartTime && startedAt && duration) {
      const endDate = addYears(new Date(startedAt), Number(duration));
      setEndedAt(endDate);
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [contractTimeType, startedAt, duration]);

  return displayFieldConfigs;
}