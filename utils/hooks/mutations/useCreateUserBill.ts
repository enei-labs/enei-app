import { CreateUserBillInput, UserBill, UserBillPage } from "@core/graphql/types";
import { CREATE_USER_BILL } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { USER_BILL_FIELDS } from "@core/graphql/fragment";

export const useCreateUserBill = () => {
  return useMutation<
    { createUserBill: UserBill },
    { input: CreateUserBillInput }
  >(CREATE_USER_BILL, {
    update(cache, { data }) {
      if (data && data.createUserBill.__typename === 'UserBill') {
        cache.modify({
          fields: {
            userBills(userBillPage: UserBillPage) {
              const newUserBill = cache.writeFragment({
                data: data.createUserBill,
                fragment: USER_BILL_FIELDS
              });

              return {
                total: userBillPage.total + 1,
                list: [newUserBill, ...userBillPage.list],
              };
            }
          },
          broadcast: false,
        });
      }
    }
  });
};
