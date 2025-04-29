import { Dashboard, RemoveUserInput, User, UserPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { DASHBOARD, USERS } from '@core/graphql/queries';
import { REMOVE_USER } from '@core/graphql/mutations';

export const useRemoveUser = () => {
  return useMutation<{ removeUser: User }, { input: RemoveUserInput }>(REMOVE_USER, {
    update(cache, { data }) {
      if (data?.removeUser) {
        // Directly evict the user from the cache
        cache.evict({ id: cache.identify(data.removeUser) });
        // Garbage collect any unreferenced objects
        cache.gc();
      }
    },
  });
};
