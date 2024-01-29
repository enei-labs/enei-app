import { ContractTimeType, RateType } from "@core/graphql/types";
import { FieldConfig } from "@core/types";
import { textValidated } from "@core/types/fieldConfig";
import { useEffect, useMemo } from "react";
import { addYears } from 'date-fns';

export const contractTimeTypeMap = {
  [ContractTimeType.ContractEndTime]: "固定日期(填入合約結束日期)",
  [ContractTimeType.ContractStartTime]: "合約年限從合約起始日期起算",
  [ContractTimeType.TransferStartTime]: "合約年限從轉供起始日期起算",
};

const contractTimeTypeOptions = Object.values(ContractTimeType).map((o) => ({
  label: contractTimeTypeMap[o],
  value: o,
}));

export const fieldConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "companyName",
    label: "公司名稱",
    disabled: true,
  },
  {
    type: "TEXT",
    name: "name",
    label: "合約名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "number",
    label: "合約編號",
    required: true,
    validated: textValidated,
  },
  {
    type: "RADIO",
    name: "rateType",
    label: "費率計算方式",
    radios: [
      {
        label: "單一費率",
        value: RateType.Single,
      },
      {
        label: "個別費率",
        value: RateType.Individual,
      },
    ],
    required: true,
  },
  {
    type: "TEXT",
    name: "price",
    label: "合約價格（元/kWh）",
    required: false,
  },
  {
    type: "SINGLE_SELECT",
    name: "contractTimeType",
    label: "合約時間計算方式",
    required: true,
    disabled: false,
    options: contractTimeTypeOptions,
  },
  {
    type: "TEXT",
    name: "duration",
    label: "合約年限（年）",
    required: false,
    validated: textValidated,
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
  {
    type: "TEXT",
    name: "transferRate",
    label: "轉供率要求（%）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "daysToPay",
    label: "付款條件（天）",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXTAREA",
    name: "description",
    label: "合約描述 / 特殊條件",
    required: false,
  },
  {
    type: "FILE",
    name: "contractDoc",
    required: true,
    label: "購電合約",
  },
  {
    type: "FILE",
    name: "industryDoc",
    required: true,
    label: "電業佐證資料",
  },
  {
    type: "FILE",
    name: "transferDoc",
    required: true,
    label: "轉供所需資料",
  },
];

export const useDisplayFieldConfigs = (
  values: {
    contractTimeType: ContractTimeType,
    rateType?: RateType,
    duration?: number,
    startedAt?: Date,
  },
  variant: 'edit' | 'create' = 'create',
  setEndedAt?: (value: Date) => void,
  ) => {
  const { contractTimeType, rateType, duration, startedAt } = values;
  const displayFieldConfigs = useMemo(() => {
    const contractTimeTypeIndex = fieldConfigs.findIndex(
      (c) => c.name === "contractTimeType"
    );
    if (variant === 'edit') fieldConfigs[contractTimeTypeIndex].disabled = true;
    const rateTypeIndex = fieldConfigs.findIndex(
      (c) => c.name === "rateType"
    );
    if (variant === 'edit') fieldConfigs[rateTypeIndex].disabled = true;

    const baseConfigs = {
      name: fieldConfigs.slice(0, 1),
      docs: fieldConfigs.slice(12),
      contract: [fieldConfigs[contractTimeTypeIndex]],
    };
    const durationIndex = fieldConfigs.findIndex((c) => c.name === "duration");
    const endAtIndex = fieldConfigs.findIndex((c) => c.name === "endedAt");

    if (!contractTimeType) return baseConfigs;

    if (contractTimeType === ContractTimeType.ContractStartTime) {
      fieldConfigs[durationIndex].required = true;
      fieldConfigs[endAtIndex].required = false;
      fieldConfigs[endAtIndex].disabled = true;
    } else if (contractTimeType === ContractTimeType.ContractEndTime) {
      fieldConfigs[durationIndex].required = false;
      fieldConfigs[endAtIndex].required = true;
      fieldConfigs[endAtIndex].disabled = false;
    }

    const index = contractTimeType === ContractTimeType.ContractEndTime ? durationIndex : endAtIndex;
    let contractFields = [
      ...fieldConfigs.slice(1, index),
      ...fieldConfigs.slice(index + 1, 12),
    ];

    if (rateType === RateType.Individual) {
      contractFields = contractFields.filter(field => field.name !== 'price');
    }

    return {
      ...baseConfigs,
      contract: contractFields,
    };
  }, [variant, contractTimeType, rateType]);

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