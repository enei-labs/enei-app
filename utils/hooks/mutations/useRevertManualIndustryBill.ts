import { useMutation } from "@apollo/client";
import { REVERT_MANUAL_INDUSTRY_BILL } from "@core/graphql/mutations";
import { IndustryBill } from "@core/graphql/types";

interface RevertManualIndustryBillInput {
  industryBillId: string;
}

export const useRevertManualIndustryBill = () => {
  return useMutation<
    { revertManualIndustryBill: IndustryBill },
    { input: RevertManualIndustryBillInput }
  >(REVERT_MANUAL_INDUSTRY_BILL);
};
