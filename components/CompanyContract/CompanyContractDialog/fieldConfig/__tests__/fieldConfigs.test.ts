import { ContractTimeType, RateType } from "@core/graphql/types";
import { FieldConfig } from "@core/types";
import { getFieldConfigs } from "../index";
import { baseFieldConfigs } from "../baseFieldConfigs";
import {
  contractStartTimeFields,
  contractEndTimeFields,
  contractTransferStartTimeFields,
} from "../conditionalFields";
import { contractTimeTypeOptions } from "../contractTimeType";
import { textValidated } from "@core/types/fieldConfig";

describe("CompanyContract fieldConfigs", () => {
  // 預期的完整配置（重構前的結果）
  const expectedBaseConfig = baseFieldConfigs;

  const expectedContractStartTimeConfig: FieldConfig[] = [
    ...baseFieldConfigs,
    {
      type: "TEXT",
      name: "duration",
      label: "合約年限（年）",
      required: true,
    },
    {
      type: "DATE",
      name: "startedAt",
      label: "合約起始日期",
      required: true,
    },
  ];

  const expectedContractEndTimeConfig: FieldConfig[] = [
    ...baseFieldConfigs,
    {
      type: "TEXT",
      name: "duration",
      label: "合約年限（年）",
      required: false,
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
      required: true,
      disabled: false,
    },
  ];

  const expectedContractTransferStartTimeConfig: FieldConfig[] = [
    ...baseFieldConfigs,
    {
      type: "TEXT",
      name: "duration",
      label: "合約年限（年）",
      required: false,
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
      
      expect(getFieldConfigs()).toHaveLength(baseCount);
      expect(getFieldConfigs(ContractTimeType.ContractStartTime)).toHaveLength(baseCount + 2); // duration, startedAt
      expect(getFieldConfigs(ContractTimeType.ContractEndTime)).toHaveLength(baseCount + 3); // duration, startedAt, endedAt
      expect(getFieldConfigs(ContractTimeType.TransferStartTime)).toHaveLength(baseCount + 3); // duration, startedAt, endedAt
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
          label: "合約名稱",
          validated: textValidated,
        })
      );

      expect(baseFieldConfigs).toContainEqual(
        expect.objectContaining({
          name: "contractTimeType",
          type: "SINGLE_SELECT",
          required: true,
          label: "合約時間計算方式",
          options: contractTimeTypeOptions,
        })
      );

      expect(baseFieldConfigs).toContainEqual(
        expect.objectContaining({
          name: "rateType",
          type: "RADIO",
          required: true,
          label: "費率計算方式",
        })
      );
    });

    it("should have different duration requirements for different contract types", () => {
      const startTimeConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      const endTimeConfig = getFieldConfigs(ContractTimeType.ContractEndTime);

      const startTimeDuration = startTimeConfig.find(field => field.name === "duration");
      const endTimeDuration = endTimeConfig.find(field => field.name === "duration");

      expect(startTimeDuration?.required).toBe(true);
      expect(endTimeDuration?.required).toBe(false);
    });

    it("should have endedAt field only for EndTime and TransferStartTime", () => {
      const startTimeConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      const endTimeConfig = getFieldConfigs(ContractTimeType.ContractEndTime);
      const transferStartTimeConfig = getFieldConfigs(ContractTimeType.TransferStartTime);

      const startTimeEndedAt = startTimeConfig.find(field => field.name === "endedAt");
      const endTimeEndedAt = endTimeConfig.find(field => field.name === "endedAt");
      const transferStartTimeEndedAt = transferStartTimeConfig.find(field => field.name === "endedAt");

      expect(startTimeEndedAt).toBeUndefined();
      expect(endTimeEndedAt).toBeDefined();
      expect(endTimeEndedAt?.required).toBe(true);
      expect(transferStartTimeEndedAt).toBeDefined();
      expect(transferStartTimeEndedAt?.required).toBe(false);
    });
  });
}); 