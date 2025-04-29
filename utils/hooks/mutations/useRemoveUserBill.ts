import { UserBill, UserBillPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_USER_BILL } from '@core/graphql/mutations/removeUserBill';
import { USER_BILLS } from '@core/graphql/queries';


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
