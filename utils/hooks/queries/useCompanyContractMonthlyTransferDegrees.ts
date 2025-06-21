import { COMPANY_CONTRACT_MONTHLY_TRANSFER_DEGREES } from "@core/graphql/queries/companyContractMonthlyTransferDegrees";
import useQuery from "../useQuery";

export const useCompanyContractMonthlyTransferDegrees = (
  companyContractId: string,
  startedAt?: string,
  endedAt?: string
) => {
  return useQuery<{ companyContractMonthlyTransferDegrees: { monthlyTotals: { month: number, totalDegrees: number }[] } }>(COMPANY_CONTRACT_MONTHLY_TRANSFER_DEGREES, {
    variables: { companyContractId, startedAt, endedAt },
  });
}; 