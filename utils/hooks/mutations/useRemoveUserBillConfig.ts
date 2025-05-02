import { UserBillConfig, UserBillConfigPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_USER_BILL_CONFIG } from '@core/graphql/mutations/removeUserBillConfig';


export const useRemoveUserBillConfig = () => {
  return useMutation<{ removeUserBillConfig: UserBillConfig }, { id: string }>(
    REMOVE_USER_BILL_CONFIG, {
      update(cache, { data }) {
        if (data?.removeUserBillConfig) {
          // Directly evict the user bill config from the cache
          cache.evict({ id: cache.identify(data.removeUserBillConfig) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
