import { USER_CONTRACT_MONTHLY_TRANSFER_DEGREES } from "@core/graphql/queries/userContractMonthlyTransferDegrees";
import useQuery from "../useQuery";

export const useUserContractMonthlyTransferDegrees = (
  userContractId: string,
  startedAt?: string,
  endedAt?: string
) => {
  return useQuery<{ userContractMonthlyTransferDegrees: { monthlyTotals: { month: number, totalDegrees: number }[] } }>(USER_CONTRACT_MONTHLY_TRANSFER_DEGREES, {
    variables: { userContractId, startedAt, endedAt },
  });
}; 