import useMutation from '../useMutation';
import { CREATE_USER_CONTRACT } from '@core/graphql/mutations';
import { CreateUserContractInput, UserContract } from '@core/graphql/types';

export const useCreateUserContract = (userId: string) => {
  return useMutation<{ createUserContract: UserContract }, { userId: string, input: CreateUserContractInput }>(
    CREATE_USER_CONTRACT, {
      update(cache, { data }) {
        if (data?.createUserContract?.__typename === 'UserContract') {
          cache.modify({
            fields: {
              userContracts: (existingData = { total: 0, list: [] }, { storeFieldName }) => {
                // Only update if this matches the userId from the query variables
                if (!storeFieldName.includes(`userId:${userId}`)) {
                  return existingData;
                }
                
                // Get reference to the newly created contract
                const newContractRef = { __ref: cache.identify(data.createUserContract) };
                
                return {
                  ...existingData,
                  total: existingData.total + 1,
                  list: [newContractRef, ...(existingData.list || [])]
                };
              }
            }
          });
        }
      },
    }
  )
}
