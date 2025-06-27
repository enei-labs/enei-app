import { TpcBill } from '@core/graphql/types';
import useQuery from '../useQuery';
import { TPC_BILL } from '@core/graphql/queries';

export const useTPCBill = (id: string) => {
  return useQuery<{ tpcBill: TpcBill }>(TPC_BILL, {
    variables: { id: id },
    skip: !id,
  })
}
