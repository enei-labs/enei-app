import { RemoveUserInput, User, UserPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { USERS } from '@core/graphql/queries';
import { REMOVE_USER } from '@core/graphql/mutations';

export const useRemoveUser = () => {
  return useMutation<{ removeUser: User }, { input: RemoveUserInput }>(REMOVE_USER, {
    update(cache, { data }) {
      if (data?.removeUser?.__typename === 'User') {
        const existingUsers = cache.readQuery<{ users: UserPage }>({ query: USERS });

        if (existingUsers) {
          cache.writeQuery({
            query: USERS,
            data: {
              users: {
                ...existingUsers.users,
                total: existingUsers.users.total - 1,
                list: existingUsers.users.list.filter(user => user.id !== data.removeUser.id),
              },
            },
          });
        }
      }
    },
  });
};
