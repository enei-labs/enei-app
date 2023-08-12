import { TpcBillPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { TPC_BILLS } from '@core/graphql/queries';

interface Variables {
  transferDocumentId?: string;
  offset?: number;
  limit?: number;
}

export const useTpcBills = (variables?: Variables) => {
  return useQuery<{ tpcBills: TpcBillPage }>(TPC_BILLS, {
    variables: variables,
  })
}
