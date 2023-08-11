import { TpcBill } from '@core/graphql/types';
import useMutation from '../useMutation';
import { TPC_BILLS } from '@core/graphql/queries';
import { REMOVE_TPC_BILL } from '@core/graphql/mutations/removeTPCBill';

export const useRemoveTPCBill = () => {
  return useMutation<{ removeTPCBill: TpcBill }, { id: string }>(
    REMOVE_TPC_BILL, {
      /** @need refactor */
      refetchQueries: [TPC_BILLS]
    }
  )
}
