import { ContractTimeType } from "@core/graphql/types";
import { useEffect, useState } from "react";
import { addYears } from 'date-fns';
import { baseFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/baseFieldConfigs";
import { contractStartTimeFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/contractStartTimeFieldConfigs";
import { contractEndTimeFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/contractEndTimeFieldConfigs";
import { contractTransferStartTimeFieldConfigs } from "@components/UserContract/UserContractDialog/fieldConfig/contractTransferStartTimeFieldConfigs";
import { FieldConfig } from '@core/types';

export const useEditDisplayFieldConfigs = (
  values: {
    contractTimeType: ContractTimeType,
    salesPeriod?: number,
    salesAt?: Date,
  },
  setEndedAt?: (value: Date) => void,
) => {
  const { contractTimeType, salesPeriod, salesAt } = values;
  const [fieldConfigs, setFieldConfigs] = useState<FieldConfig[]>(baseFieldConfigs);

  useEffect(() => {
    let newFieldConfigs = baseFieldConfigs;

    if (!contractTimeType) {
      setFieldConfigs(baseFieldConfigs);
      return;
    }

    switch (contractTimeType) {
      case ContractTimeType.ContractStartTime:
        newFieldConfigs = contractStartTimeFieldConfigs;
        break;
      case ContractTimeType.ContractEndTime:
        newFieldConfigs = contractEndTimeFieldConfigs;
        break;
      case ContractTimeType.TransferStartTime:
        newFieldConfigs = contractTransferStartTimeFieldConfigs;
        break;
    }

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