import { renderHook, act } from '@testing-library/react';
import { ContractTimeType } from "@core/graphql/types";
import { useCreateDisplayFieldConfigs } from "../useCreateDisplayFieldConfigs";
import { useEditDisplayFieldConfigs } from "../useEditDisplayFieldConfigs";
import { getFieldConfigs } from "../index";

describe("Display Field Configs Hooks", () => {
  describe("useCreateDisplayFieldConfigs", () => {
    it("should return correct config based on contractTimeType", () => {
      const { result } = renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractStartTime,
          salesPeriod: 5,
          salesAt: new Date('2024-01-01'),
        })
      );

      const expectedConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      expect(result.current).toEqual(expectedConfig);
    });

    it("should update config when contractTimeType changes", () => {
      const { result, rerender } = renderHook(
        ({ contractTimeType }) =>
          useCreateDisplayFieldConfigs({
            contractTimeType,
            salesPeriod: 5,
            salesAt: new Date('2024-01-01'),
          }),
        {
          initialProps: { contractTimeType: ContractTimeType.ContractStartTime }
        }
      );

      const initialConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      expect(result.current).toEqual(initialConfig);

      // Change contract time type
      rerender({ contractTimeType: ContractTimeType.ContractEndTime });

      const updatedConfig = getFieldConfigs(ContractTimeType.ContractEndTime);
      expect(result.current).toEqual(updatedConfig);
    });

    it("should call setEndedAt when contractTimeType is ContractStartTime", () => {
      const mockSetEndedAt = jest.fn();
      const salesAt = new Date('2024-01-01');
      const salesPeriod = 5;

      renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractStartTime,
          salesPeriod,
          salesAt,
        }, mockSetEndedAt)
      );

      expect(mockSetEndedAt).toHaveBeenCalledWith(
        new Date('2029-01-01') // 5 years later
      );
    });

    it("should not call setEndedAt when contractTimeType is not ContractStartTime", () => {
      const mockSetEndedAt = jest.fn();

      renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractEndTime,
          salesPeriod: 5,
          salesAt: new Date('2024-01-01'),
        }, mockSetEndedAt)
      );

      expect(mockSetEndedAt).not.toHaveBeenCalled();
    });

    it("should return base config when contractTimeType is undefined", () => {
      const { result } = renderHook(() =>
        useCreateDisplayFieldConfigs({
          contractTimeType: undefined as any,
        })
      );

      const expectedConfig = getFieldConfigs();
      expect(result.current).toEqual(expectedConfig);
    });
  });

  describe("useEditDisplayFieldConfigs", () => {
    it("should return correct config based on contractTimeType", () => {
      const { result } = renderHook(() =>
        useEditDisplayFieldConfigs({
          contractTimeType: ContractTimeType.ContractEndTime,
        })
      );

      const expectedConfig = getFieldConfigs(ContractTimeType.ContractEndTime);
      expect(result.current).toEqual(expectedConfig);
    });

    it("should update config when contractTimeType changes", () => {
      const { result, rerender } = renderHook(
        ({ contractTimeType }) =>
          useEditDisplayFieldConfigs({
            contractTimeType,
          }),
        {
          initialProps: { contractTimeType: ContractTimeType.ContractStartTime }
        }
      );

      const initialConfig = getFieldConfigs(ContractTimeType.ContractStartTime);
      expect(result.current).toEqual(initialConfig);

      // Change contract time type
      rerender({ contractTimeType: ContractTimeType.TransferStartTime });

      const updatedConfig = getFieldConfigs(ContractTimeType.TransferStartTime);
      expect(result.current).toEqual(updatedConfig);
    });

    it("should return base config when contractTimeType is undefined", () => {
      const { result } = renderHook(() =>
        useEditDisplayFieldConfigs({
          contractTimeType: undefined as any,
        })
      );

      const expectedConfig = getFieldConfigs();
      expect(result.current).toEqual(expectedConfig);
    });
  });

  describe("Integration between hooks and getFieldConfigs", () => {
    it("should return same results for same inputs", () => {
      const contractTimeType = ContractTimeType.ContractStartTime;
      
      const directResult = getFieldConfigs(contractTimeType);
      
      const { result: createResult } = renderHook(() =>
        useCreateDisplayFieldConfigs({ contractTimeType })
      );
      
      const { result: editResult } = renderHook(() =>
        useEditDisplayFieldConfigs({ contractTimeType })
      );

      expect(createResult.current).toEqual(directResult);
      expect(editResult.current).toEqual(directResult);
    });
  });
}); 