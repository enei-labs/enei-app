import { UserBill, Fee } from '@core/graphql/types'
import useQuery from '../useQuery'
import { USER_BILL } from '@core/graphql/queries';

export const useUserBill = (id: string) => {
  return useQuery<{ userBill: UserBill, fee: Fee }>(USER_BILL, {
    variables: { id: id },
    skip: !id,
  })
}
