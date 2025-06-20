import { TPC_BILL_MONTHLY_TRANSFER_DEGREES } from "@core/graphql/queries/tpcBillMonthlyTransferDegrees";
import useQuery from "../useQuery";

interface Variables {
  startedAt?: string;
  endedAt?: string;
}

export const useTpcBillMonthlyTransferDegrees = (variables?: Variables) => {
  return useQuery(TPC_BILL_MONTHLY_TRANSFER_DEGREES, {
    variables,
  });
}; 