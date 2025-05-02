import { UserBill } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_USER_BILL } from '@core/graphql/mutations/removeUserBill';


export const useRemoveUserBill = () => {
  return useMutation<{ removeUserBill: UserBill }, { id: string }>(
    REMOVE_USER_BILL, {
      update(cache, { data }) {
        if (data?.removeUserBill) {
          // Directly evict the user bill from the cache
          cache.evict({ id: cache.identify(data.removeUserBill) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
