import { ContractTimeType, RateType } from "@core/graphql/types";
import { useEffect, useMemo } from "react";
import { addYears } from 'date-fns';
import { baseFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/baseFieldConfigs";
import { contractStartTimeFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/contractStartTimeFieldConfigs";
import { contractEndTimeFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/contractEndTimeFieldConfigs";
import { contractTransferStartTimeFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/contractTransferStartTimeFieldConfigs";


export const useCreateDisplayFieldConfigs = (
  values: {
    contractTimeType: ContractTimeType,
    salesPeriod?: number,
    salesAt?: Date,
  },
  setEndedAt?: (value: Date) => void,
  ) => {
  const { contractTimeType, salesPeriod, salesAt } = values;

  const displayFieldConfigs = useMemo(() => {
    let fieldConfigs = baseFieldConfigs;

    if (!contractTimeType) return baseFieldConfigs;

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


    return fieldConfigs;
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

  return displayFieldConfigs;
}