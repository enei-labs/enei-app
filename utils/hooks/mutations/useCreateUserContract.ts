import useMutation from '../useMutation';
import { CREATE_USER_CONTRACT } from '@core/graphql/mutations';
import { CreateUserContractInput, UserContract, UserContractPage } from '@core/graphql/types';
import { USER_CONTRACTS } from '@core/graphql/queries';
import { StringNullableChain } from 'lodash';

export const useCreateUserContract = (userId: string) => {
  return useMutation<{ createUserContract: UserContract }, { userId: string, input: CreateUserContractInput }>(
    CREATE_USER_CONTRACT, {
      update(cache, { data }) {
        if (data?.createUserContract?.__typename === 'UserContract') {
          const existingUserContracts = cache.readQuery<{ userContracts: UserContractPage }>({ query: USER_CONTRACTS, variables: { limit: 10, offset: 0, userId } });

          if (existingUserContracts) {
            cache.writeQuery({
              query: USER_CONTRACTS,
              variables: { limit: 10, offset: 0, userId },
              data: {
                userContracts: {
                  ...existingUserContracts.userContracts,
                  total: existingUserContracts.userContracts.total + 1,
                  list: [data.createUserContract, ...existingUserContracts.userContracts.list],
                },
              },
            });
          }
        }
      },
    }
  )
}
