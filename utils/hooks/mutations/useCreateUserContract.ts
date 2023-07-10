import { USER_CONTRACT_FIELDS } from '@core/graphql/fragment';
import useMutation from '../useMutation';
import { CREATE_USER_CONTRACT } from '@core/graphql/mutations';
import { CreateUserContractInput, UserContract, UserContractPage } from '@core/graphql/types';

export const useCreateUserContract = () => {
  return useMutation<{ createUserContract: UserContract }, { userId: string, input: CreateUserContractInput }>(
    CREATE_USER_CONTRACT, {
      update(cache, { data }) {
        if (data && data.createUserContract.__typename === 'UserContract') {
          cache.modify({
            fields: {
              userContracts(userContractPage: UserContractPage) {
                const newUserContract = cache.writeFragment({
                  data: data.createUserContract,
                  fragment: USER_CONTRACT_FIELDS
                });

                return {
                  total: userContractPage.total + 1,
                  list: [newUserContract, ...userContractPage.list],
                };
              }
            },
            broadcast: false,
          });
        }
      }
    }
  )
}
