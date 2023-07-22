import useMutation from '../useMutation';
import { CREATE_USER_CONTRACT } from '@core/graphql/mutations';
import { CreateUserContractInput, UserContract } from '@core/graphql/types';
import { USER_CONTRACTS } from '@core/graphql/queries';

export const useCreateUserContract = () => {
  return useMutation<{ createUserContract: UserContract }, { userId: string, input: CreateUserContractInput }>(
    CREATE_USER_CONTRACT, {
      /** @need refactor */
      refetchQueries: [USER_CONTRACTS]
    }
  )
}
