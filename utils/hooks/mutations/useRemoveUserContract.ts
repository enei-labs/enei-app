import { UserContract, UserContractPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_USER_CONTRACT } from '@core/graphql/mutations/removeUserContract';
import { USER_CONTRACTS } from '@core/graphql/queries';


export const useRemoveUserContract = (userId: string) => {
  return useMutation<{ removeUserContract: UserContract }, { id: string }>(
    REMOVE_USER_CONTRACT, {
      update(cache, { data }) {
        if (data?.removeUserContract?.__typename === 'UserContract') {
          const existingUserContracts = cache.readQuery<{ userContracts: UserContractPage }>({ query: USER_CONTRACTS, variables: { userId, offset: 0, limit: 10 } });

          if (existingUserContracts) {
            cache.writeQuery({
              query: USER_CONTRACTS,
              variables: { userId, offset: 0, limit: 10 },
              data: {
                userContracts: {
                  ...existingUserContracts.userContracts,
                  total: existingUserContracts.userContracts.total - 1,
                  list: existingUserContracts.userContracts.list.filter(contract => contract.id !== data.removeUserContract.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
