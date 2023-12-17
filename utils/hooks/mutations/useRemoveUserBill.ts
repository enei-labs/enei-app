import { UserBill, UserBillPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_USER_BILL } from '@core/graphql/mutations/removeUserBill';
import { USER_BILLS } from '@core/graphql/queries';


export const useRemoveUserBill = () => {
  return useMutation<{ removeUserBill: UserBill }, { id: string }>(
    REMOVE_USER_BILL, {
      update(cache, { data }) {
        if (data?.removeUserBill?.__typename === 'UserBill') {
          const existingUserBills = cache.readQuery<{ userBills: UserBillPage }>({ query: USER_BILLS });

          if (existingUserBills) {
            cache.writeQuery({
              query: USER_BILLS,
              data: {
                usersBills: {
                  ...existingUserBills.userBills,
                  total: existingUserBills.userBills.total - 1,
                  list: existingUserBills.userBills.list.filter(user => user.id !== data.removeUserBill.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
