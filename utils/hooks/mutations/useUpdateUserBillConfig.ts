import { UpdateUserBillConfigInput, UserBillConfig } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_USER_BILL_CONFIG } from '@core/graphql/mutations'
import { USER_BILL_CONFIGS } from '@core/graphql/queries'

export const useUpdateUserBillConfig = () => {
  return useMutation<{ updateUserBillConfig: UserBillConfig }, { input: UpdateUserBillConfigInput }>(
    UPDATE_USER_BILL_CONFIG,
    {
      refetchQueries: [USER_BILL_CONFIGS],
    }
  )
}
