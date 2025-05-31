import { renderHook } from '@testing-library/react';
import { ContractTimeType, RateType } from "@core/graphql/types";
import { useCreateDisplayFieldConfigs } from "../useCreateDisplayFieldConfigs";
import { useEditDisplayFieldConfigs } from "../useEditDisplayFieldConfigs";
import { getFieldConfigs } from "../index";
import { baseFieldConfigs } from "../baseFieldConfigs";

describe("CompanyContract Display Field Configs Hooks", () => {
  describe("useCreateDisplayFieldConfigs", () => {
    it("should return correct structured config based on contractTimeType", () => {
      const { result } = renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractStartTime,
          rateType: RateType.Single,
          duration: 5,
          startedAt: new Date('2024-01-01'),
        })
      );

      const expectedFullConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      
      expect(result.current.name).toEqual([baseFieldConfigs[0]]);
      expect(result.current.contract).toEqual(expectedFullConfig);
      expect(result.current.docs).toEqual(baseFieldConfigs.slice(-3));
    });

    it("should filter out price field when rateType is Individual", () => {
      const { result } = renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractStartTime,
          rateType: RateType.Individual,
          duration: 5,
          startedAt: new Date('2024-01-01'),
        })
      );

      const contractFields = result.current.contract;
      const priceField = contractFields.find(field => field.name === 'price');
      
      expect(priceField).toBeUndefined();
    });

    it("should include price field when rateType is Single", () => {
      const { result } = renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractStartTime,
          rateType: RateType.Single,
          duration: 5,
          startedAt: new Date('2024-01-01'),
        })
      );

      const contractFields = result.current.contract;
      const priceField = contractFields.find(field => field.name === 'price');
      
      expect(priceField).toBeDefined();
    });

    it("should update config when contractTimeType changes", () => {
      const { result, rerender } = renderHook(
        ({ contractTimeType }) =>
          useCreateDisplayFieldConfigs({
            contractTimeType,
            rateType: RateType.Single,
            duration: 5,
            startedAt: new Date('2024-01-01'),
          }),
        {
          initialProps: { contractTimeType: ContractTimeType.ContractStartTime }
        }
      );

      const initialConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      expect(result.current.contract).toEqual(initialConfig);

      // Change contract time type
      rerender({ contractTimeType: ContractTimeType.ContractEndTime });

      const updatedConfig = getFieldConfigs(ContractTimeType.ContractEndTime);
      expect(result.current.contract).toEqual(updatedConfig);
    });

    it("should call setEndedAt when contractTimeType is ContractStartTime", () => {
      const mockSetEndedAt = jest.fn();
      const startedAt = new Date('2024-01-01');
      const duration = 5;

      renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractStartTime,
          rateType: RateType.Single,
          duration,
          startedAt,
        }, mockSetEndedAt)
      );

      expect(mockSetEndedAt).toHaveBeenCalledWith(
        new Date('2029-01-01') // 5 years later
      );
    });

    it("should return base configs when contractTimeType is undefined", () => {
      const { result } = renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: undefined as any,
          rateType: RateType.Single,
        })
      );

      expect(result.current.name).toEqual([baseFieldConfigs[0]]);
      expect(result.current.contract).toEqual([baseFieldConfigs[1]]);
      expect(result.current.docs).toEqual(baseFieldConfigs.slice(-3));
    });
  });

  describe("useEditDisplayFieldConfigs", () => {
    it("should return correct structured config based on contractTimeType", () => {
      const { result } = renderHook(() =>
        useEditDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractEndTime,
          rateType: RateType.Single,
        })
      );

      const expectedFullConfig = getFieldConfigs(ContractTimeType.ContractEndTime);
      expect(result.current.contract).toEqual(expectedFullConfig);
    });

    it("should filter out price field when rateType is Individual", () => {
      const { result } = renderHook(() =>
        useEditDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractEndTime,
          rateType: RateType.Individual,
        })
      );

      const contractFields = result.current.contract;
      const priceField = contractFields.find(field => field.name === 'price');
      
      expect(priceField).toBeUndefined();
    });

    it("should update config when contractTimeType changes", () => {
      const { result, rerender } = renderHook(
        ({ contractTimeType }) =>
          useEditDisplayFieldConfigs({
            contractTimeType,
            rateType: RateType.Single,
          }),
        {
          initialProps: { contractTimeType: ContractTimeType.ContractStartTime }
        }
      );

      const initialConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      expect(result.current.contract).toEqual(initialConfig);

      // Change contract time type
      rerender({ contractTimeType: ContractTimeType.TransferStartTime });

      const updatedConfig = getFieldConfigs(ContractTimeType.TransferStartTime);
      expect(result.current.contract).toEqual(updatedConfig);
    });
  });

  describe("Integration between hooks and getFieldConfigs", () => {
    it("should return the structured format from hooks", () => {
      const contractTimeType = ContractTimeType.ContractStartTime;
      const rateType = RateType.Single;
      
      const { result: createResult } = renderHook(() =>
        useCreateDisplayFieldConfigs({ contractTimeType, rateType })
      );
      
      const { result: editResult } = renderHook(() =>
        useEditDisplayFieldConfigs({ contractTimeType, rateType })
      );

      // Both hooks should return structured format
      expect(createResult.current).toHaveProperty('name');
      expect(createResult.current).toHaveProperty('contract');
      expect(createResult.current).toHaveProperty('docs');
      
      expect(editResult.current).toHaveProperty('name');
      expect(editResult.current).toHaveProperty('contract');
      expect(editResult.current).toHaveProperty('docs');
    });
  });
}); 