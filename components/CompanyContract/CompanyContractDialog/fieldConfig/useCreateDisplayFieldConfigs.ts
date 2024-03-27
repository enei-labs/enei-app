import { ContractTimeType, RateType } from "@core/graphql/types";
import { useEffect, useMemo } from "react";
import { addYears } from 'date-fns';
import { baseFieldConfigs } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/baseFieldConfigs";
import { contractStartTimeFieldConfigs } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/contractStartTimeFieldConfigs";
import { contractEndTimeFieldConfigs } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/contractEndTimeFieldConfigs";
import { contractTransferStartTimeFieldConfigs } from "@components/CompanyContract/CompanyContractDialog/fieldConfig/contractTransferStartTimeFieldConfigs";

export const useCreateDisplayFieldConfigs = (
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
    let fieldConfigs = baseFieldConfigs;
    const baseConfigs = {
      name: [baseFieldConfigs[0]],
      contract: [baseFieldConfigs[1]],
      docs: baseFieldConfigs.slice(2),
    };

    if (!contractTimeType) return baseConfigs;

    switch (contractTimeType) {
      case ContractTimeType.ContractStartTime:
        fieldConfigs = contractStartTimeFieldConfigs;
        break;
      case ContractTimeType.ContractEndTime:
        fieldConfigs = contractEndTimeFieldConfigs;
        break;
      case ContractTimeType.TransferStartTime:
        fieldConfigs = contractTransferStartTimeFieldConfigs;
        break;
    }


    if (rateType === RateType.Individual) {
      fieldConfigs = fieldConfigs.filter(field => field.name !== 'price');
    }

    return {
      ...baseConfigs,
      contract: fieldConfigs,
    };
  }, [contractTimeType, rateType]);

  console.log({ displayFieldConfigs });

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