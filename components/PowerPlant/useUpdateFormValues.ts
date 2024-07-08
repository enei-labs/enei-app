import { CompanyContract, EnergyType, GenerationType, PowerPlant, RateType } from '@core/graphql/types'; // 假設這是你的類型定義
import FieldConfig, { numberRangeValidated, numberValidated, textValidated } from '@core/types/fieldConfig';



interface UpdateFormValuesParams {
  initialDefaultValues: Partial<Omit<PowerPlant, "annualPowerGeneration">>;
  companyContract?: CompanyContract;
}

interface UpdateFormValuesReturns {
  defaultValues: Partial<Omit<PowerPlant, "annualPowerGeneration">>;
  configs: FieldConfig[];
}

export enum EnergyLabel {
  SOLAR = "太陽能",
  WIND = "風力",
  OTHER_RENEWABLE = "其他再生能源",
}

export enum GenerationLabel {
  TYPE_I = "第一型",
  TYPE_II = "第二型",
  TYPE_III = "第三型",
}

export const initialConfigs: FieldConfig[] = [
  {
    type: "TEXT",
    name: "name",
    label: "電廠名稱",
    required: true,
    validated: textValidated,
  },
  {
    type: "TEXT",
    name: "number",
    label: "電號",
    required: true,
    validated: textValidated,
  },
  {
    type: "NUMBER",
    name: "volume",
    label: "電廠裝置容量(kW)",
    required: true,
    validated: numberValidated,
  },
  {
    type: "NUMBER",
    name: "transferRate",
    label: "供電容量比例(%)",
    required: true,
    validated: numberRangeValidated,
  },
  {
    type: "NUMBER",
    name: "supplyVolume",
    label: "供電裝置容量(kW)",
    disabled: true,
  },
  {
    type: "TEXT",
    name: "price",
    label: "費率（元/kWh)",
    required: true,
    validated: textValidated,
  },
  {
    type: "NUMBER",
    name: "estimatedAnnualPowerGeneration",
    label: "單位預估年發電量（度/kWh）",
    required: true,
    validated: numberValidated,
  },
  {
    type: "RADIO",
    name: "generationType",
    label: "能源類別",
    radios: [
      {
        label: GenerationLabel.TYPE_I,
        value: GenerationType.TypeI,
      },
      {
        label: GenerationLabel.TYPE_II,
        value: GenerationType.TypeIi,
      },
      {
        label: GenerationLabel.TYPE_III,
        value: GenerationType.TypeIii,
      },
    ],
    required: true,
  },
  {
    type: "RADIO",
    name: "energyType",
    label: "發電類型",
    radios: [
      {
        label: EnergyLabel.SOLAR,
        value: EnergyType.Solar,
      },
      {
        label: EnergyLabel.WIND,
        value: EnergyType.Wind,
      },
      {
        label: EnergyLabel.OTHER_RENEWABLE,
        value: EnergyType.OtherRenewable,
      },
    ],
    required: true,
  },
  {
    type: "TEXT",
    name: "address",
    label: "地址",
    required: true,
    validated: textValidated,
  },
];


export function updateFormValues({ initialDefaultValues, companyContract }: UpdateFormValuesParams): UpdateFormValuesReturns {
  let newDefaultValues = { transferRate: 100, ...initialDefaultValues };
  let newConfigs: FieldConfig[] = [...initialConfigs,   {
    type: "SINGLE_SELECT",
    name: "recipientAccount",
    label: "銀行帳號",
    required: true,
    options: companyContract?.company.recipientAccounts?.map((bankAccount) => ({
        label: `(${bankAccount.bankCode}) ${bankAccount.account}`,
        value: `${bankAccount.bankBranchCode}|${bankAccount.account}`,
      })) ?? []
    },
  ]; // 使用初始配置的副本

  if (companyContract && companyContract.rateType === RateType.Single) {
    const priceIndex = newConfigs.findIndex((config) => config.name === "price");
    if (priceIndex !== -1) {
      newConfigs[priceIndex] = { ...newConfigs[priceIndex], disabled: true };
      newDefaultValues.price = companyContract.price;
    }
  }

  return { defaultValues: newDefaultValues, configs: newConfigs };
}