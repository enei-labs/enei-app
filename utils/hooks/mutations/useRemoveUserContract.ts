import { UserContract } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_USER_CONTRACT } from '@core/graphql/mutations/removeUserContract';

export const useRemoveUserContract = (userId: string) => {
  return useMutation<{ removeUserContract: UserContract }, { id: string }>(
    REMOVE_USER_CONTRACT, {
      update(cache, { data }) {
        if (data?.removeUserContract) {
          // Directly evict the user contract from the cache
          cache.evict({ id: cache.identify(data.removeUserContract) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
