import useMutation from '../useMutation';
import { CREATE_USER_CONTRACT } from '@core/graphql/mutations';
import { CreateUserContractInput, UserContract } from '@core/graphql/types';

export const useCreateUserContract = () => {
  return useMutation<{ createUserContract: UserContract }, { userId: string, input: CreateUserContractInput }>(
    CREATE_USER_CONTRACT,
  )
}
