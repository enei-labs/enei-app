import { Account, CreateAccountInput } from "@core/graphql/types";
import { CREATE_ACCOUNT } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateAccount = () => {
  return useMutation<{ createAccount: Account }, { input: CreateAccountInput }>(
    CREATE_ACCOUNT
  );
};
