import useMutation from '../useMutation';
import { CREATE_USER_CONTRACT } from '@core/graphql/mutations';
import { CreateUserContractInput, UserContract, UserContractPage } from '@core/graphql/types';
import { USER_CONTRACTS } from '@core/graphql/queries';

export const useCreateUserContract = () => {
  return useMutation<{ createUserContract: UserContract }, { userId: string, input: CreateUserContractInput }>(
    CREATE_USER_CONTRACT, {
      update(cache, { data }) {
        if (data?.createUserContract?.__typename === 'UserContract') {
          const existingUserContracts = cache.readQuery<{ userContracts: UserContractPage }>({ query: USER_CONTRACTS });

          if (existingUserContracts) {
            cache.writeQuery({
              query: USER_CONTRACTS,
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
