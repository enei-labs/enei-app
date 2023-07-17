import { UserBill } from '@core/graphql/types';
import useMutation from '../useMutation';
import { USER_BILLS } from '@core/graphql/queries';
import { REMOVE_USER } from '@core/graphql/mutations';


export const useRemoveUserBill = () => {
  return useMutation<{ removeUserBill: UserBill }, { id: string }>(
    REMOVE_USER, {
      /** @need refactor */
      refetchQueries: [USER_BILLS]
    }
  )
}
