// import { CreateUserBillInput, UserBill, UserBillPage } from "@core/graphql/types";
// import { CREATE_USER_BILL } from "@core/graphql/mutations";
// import useMutation from "../useMutation";
// import { USER_BILLS } from "@core/graphql/queries";

export const useCreateUserBill = () => {
  // return useMutation<
  //   { createUserBill: UserBill },
  //   { input: CreateUserBillInput }
  // >(CREATE_USER_BILL, {
  //   update(cache, { data }) {
  //     if (data?.createUserBill?.__typename === 'UserBill') {
  //       const existingUserBills = cache.readQuery<{ userBills: UserBillPage }>({ query: USER_BILLS, variables: { limit: 10, offset: 0 } });

  //       if (existingUserBills) {
  //         cache.writeQuery({
  //           query: USER_BILLS,
  //           variables: { limit: 10, offset: 0 },
  //           data: {
  //             userBills: {
  //               ...existingUserBills.userBills,
  //               total: existingUserBills.userBills.total + 1,
  //               list: [data.createUserBill, ...existingUserBills.userBills.list],
  //             },
  //           },
  //         });
  //       }
  //     }
  //   },
  // });
};
