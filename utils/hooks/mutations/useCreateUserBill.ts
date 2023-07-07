import { CreateUserBillInput, UserBill } from "@core/graphql/types";
import { CREATE_USER_BILL } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateUserBill = () => {
  return useMutation<
    { createUserBill: UserBill },
    { input: CreateUserBillInput }
  >(CREATE_USER_BILL);
};
