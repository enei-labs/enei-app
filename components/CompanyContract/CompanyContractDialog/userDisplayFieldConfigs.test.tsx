import { renderHook } from "@testing-library/react-hooks";
import { useDisplayFieldConfigs } from "./fieldConfigs";
import { ContractTimeType, RateType } from "@core/graphql/types";

describe("useDisplayFieldConfigs with different contractTimeTypes", () => {
  it("sets duration required when contractTimeType is ContractStartTime", () => {
    const { result } = renderHook(() =>
      useDisplayFieldConfigs({
        contractTimeType: ContractTimeType.ContractStartTime,
        rateType: RateType.Single,
        duration: 1,
        startedAt: new Date(),
      })
    );

    const durationField = result.current.contract.find(
      (c) => c.name === "duration"
    );
    if (durationField) {
      expect(durationField.required).toBe(true);
      expect(durationField.disabled).toBeUndefined();
    } else {
      fail("duration field not found");
    }
  });

  it("sets endedAt required and not disabled when contractTimeType is ContractEndTime", () => {
    const { result } = renderHook(() =>
      useDisplayFieldConfigs({
        contractTimeType: ContractTimeType.ContractEndTime,
        rateType: RateType.Single,
        duration: 1,
        startedAt: new Date(),
      })
    );
    const endedAtField = result.current.contract.find(
      (c) => c.name === "endedAt"
    );
    if (endedAtField) {
      expect(endedAtField.required).toBe(true);
      expect(endedAtField.disabled).toBe(false);
    } else {
      fail("endedAt field not found");
    }
  });

  // Add more tests for other contractTimeType values and their expected outcomes
});
