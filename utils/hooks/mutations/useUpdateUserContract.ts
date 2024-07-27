import { UpdateUserContractInput, UserContract } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_USER_CONTRACT } from '@core/graphql/mutations/updateUserContract'
import { USER_CONTRACTS } from '@core/graphql/queries'

export const useUpdateUserContract = () => {
  return useMutation<{ updateUserContract: UserContract }, { input: UpdateUserContractInput }>(
    UPDATE_USER_CONTRACT,
    {
      refetchQueries: [USER_CONTRACTS],
    }
  )
}
