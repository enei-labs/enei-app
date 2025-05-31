import { ContractTimeType } from "@core/graphql/types";
import { FieldConfig } from "@core/types";
import { getFieldConfigs } from "../index";
import { baseFieldConfigs } from "../baseFieldConfigs";
import {
  contractStartTimeFields,
  contractEndTimeFields,
  contractTransferStartTimeFields,
} from "../conditionalFields";
import { contractTimeTypeOptions } from "../contractTimeType";
import { priceValidated } from "@core/types/fieldConfig";

describe("fieldConfigs", () => {
  // 預期的完整配置（重構前的結果）
  const expectedBaseConfig = baseFieldConfigs;

  const expectedContractStartTimeConfig: FieldConfig[] = [
    ...baseFieldConfigs,
    {
      type: "DATE",
      name: "salesAt",
      required: true,
      label: "契約起始日期",
    },
    {
      type: "DATE",
      name: "salesTo",
      label: "契約結束日期",
      required: false,
    },
    {
      type: "NUMBER",
      name: "salesPeriod",
      required: true,
      label: "賣電年限",
    },
    {
      type: "DATE",
      name: "transferAt",
      required: true,
      label: "預計開始轉供綠電日期",
    },
  ];

  const expectedContractEndTimeConfig: FieldConfig[] = [
    ...baseFieldConfigs,
    {
      type: "DATE",
      name: "salesAt",
      required: true,
      label: "契約起始日期",
    },
    {
      type: "DATE",
      name: "salesTo",
      label: "契約結束日期",
      required: true,
      disabled: false,
    },
    {
      type: "NUMBER",
      name: "salesPeriod",
      required: true,
      label: "賣電年限",
    },
    {
      type: "DATE",
      name: "transferAt",
      required: true,
      label: "預計開始轉供綠電日期",
    },
  ];

  const expectedContractTransferStartTimeConfig: FieldConfig[] = [
    ...baseFieldConfigs,
    {
      type: "DATE",
      name: "salesAt",
      required: true,
      label: "契約起始日期",
    },
    {
      type: "DATE",
      name: "salesTo",
      label: "契約結束日期",
      required: false,
    },
    {
      type: "NUMBER",
      name: "salesPeriod",
      required: true,
      label: "賣電年限",
    },
    {
      type: "DATE",
      name: "transferAt",
      required: true,
      label: "預計開始轉供綠電日期",
    },
  ];

  describe("getFieldConfigs", () => {
    it("should return base config when no contractTimeType is provided", () => {
      const result = getFieldConfigs();
      expect(result).toEqual(expectedBaseConfig);
    });

    it("should return base config when contractTimeType is undefined", () => {
      const result = getFieldConfigs(undefined);
      expect(result).toEqual(expectedBaseConfig);
    });

    it("should return correct config for ContractStartTime", () => {
      const result = getFieldConfigs(ContractTimeType.ContractStartTime);
      expect(result).toEqual(expectedContractStartTimeConfig);
    });

    it("should return correct config for ContractEndTime", () => {
      const result = getFieldConfigs(ContractTimeType.ContractEndTime);
      expect(result).toEqual(expectedContractEndTimeConfig);
    });

    it("should return correct config for TransferStartTime", () => {
      const result = getFieldConfigs(ContractTimeType.TransferStartTime);
      expect(result).toEqual(expectedContractTransferStartTimeConfig);
    });

    it("should have correct field count for each contract type", () => {
      const baseCount = baseFieldConfigs.length;
      const additionalFieldsCount = 4; // salesAt, salesTo, salesPeriod, transferAt

      expect(getFieldConfigs()).toHaveLength(baseCount);
      expect(getFieldConfigs(ContractTimeType.ContractStartTime)).toHaveLength(baseCount + additionalFieldsCount);
      expect(getFieldConfigs(ContractTimeType.ContractEndTime)).toHaveLength(baseCount + additionalFieldsCount);
      expect(getFieldConfigs(ContractTimeType.TransferStartTime)).toHaveLength(baseCount + additionalFieldsCount);
    });

    it("should preserve base fields order and properties", () => {
      const result = getFieldConfigs(ContractTimeType.ContractStartTime);
      const baseFieldsInResult = result.slice(0, baseFieldConfigs.length);
      
      expect(baseFieldsInResult).toEqual(baseFieldConfigs);
    });

    it("should have unique field names in each configuration", () => {
      const configurations = [
        getFieldConfigs(),
        getFieldConfigs(ContractTimeType.ContractStartTime),
        getFieldConfigs(ContractTimeType.ContractEndTime),
        getFieldConfigs(ContractTimeType.TransferStartTime),
      ];

      configurations.forEach((config) => {
        const fieldNames = config.map(field => field.name);
        const uniqueFieldNames = Array.from(new Set(fieldNames));
        expect(fieldNames).toHaveLength(uniqueFieldNames.length);
      });
    });
  });

  describe("individual field configurations", () => {
    it("should have correct base fields", () => {
      expect(baseFieldConfigs).toContainEqual(
        expect.objectContaining({
          name: "name",
          type: "TEXT",
          required: true,
          label: "契約名稱",
        })
      );

      expect(baseFieldConfigs).toContainEqual(
        expect.objectContaining({
          name: "contractTimeType",
          type: "SINGLE_SELECT",
          required: true,
          label: "契約時間計算方式",
          options: contractTimeTypeOptions,
        })
      );
    });

    it("should have different salesTo requirements for different contract types", () => {
      const startTimeConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      const endTimeConfig = getFieldConfigs(ContractTimeType.ContractEndTime);

      const startTimeSalesTo = startTimeConfig.find(field => field.name === "salesTo");
      const endTimeSalesTo = endTimeConfig.find(field => field.name === "salesTo");

      expect(startTimeSalesTo?.required).toBe(false);
      expect(endTimeSalesTo?.required).toBe(true);
    });
  });
}); 