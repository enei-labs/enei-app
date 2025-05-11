import { UpdateUserContractInput, UserContract } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_USER_CONTRACT } from '@core/graphql/mutations/updateUserContract'
import { USER_CONTRACTS } from '@core/graphql/queries'

export const useUpdateUserContract = (userId: string) => {
  return useMutation<{ updateUserContract: UserContract }, { input: UpdateUserContractInput }>(
    UPDATE_USER_CONTRACT,
    {
      update(cache, { data }) {
        if (data?.updateUserContract) {
          cache.evict({ id: cache.identify(data.updateUserContract) });
          cache.gc();
        }
      },
      refetchQueries: [
        {
          query: USER_CONTRACTS,
          variables: {
            userId,
          }
        }
      ],
    }
  )
}
