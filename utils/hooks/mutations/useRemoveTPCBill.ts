import { TpcBill } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_TPC_BILL } from '@core/graphql/mutations/removeTPCBill';

export const useRemoveTPCBill = () => {
  return useMutation<{ removeTPCBill: TpcBill }, { id: string }>(
    REMOVE_TPC_BILL, {
      update(cache, { data }) {
        if (data?.removeTPCBill) {
          // Directly evict the TPC bill from the cache
          cache.evict({ id: cache.identify(data.removeTPCBill) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
