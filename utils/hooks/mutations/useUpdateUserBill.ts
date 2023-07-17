import { UpdateUserBillInput, UserBill } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_USER_BILL } from '@core/graphql/mutations'

export const useUpdateUserBill = () => {
  return useMutation<{ updateUserBill: UserBill }, { input: UpdateUserBillInput }>(
    UPDATE_USER_BILL,
  )
}
