import { RemoveUserInput, User } from '@core/graphql/types';
import useMutation from '../useMutation';
import { USERS } from '@core/graphql/queries';
import { REMOVE_USER } from '@core/graphql/mutations';


export const useRemoveUser = () => {
  return useMutation<{ removeUser: User }, { input: RemoveUserInput }>(
    REMOVE_USER, {
      /** @need refactor */
      refetchQueries: [USERS]
    }
  )
}
