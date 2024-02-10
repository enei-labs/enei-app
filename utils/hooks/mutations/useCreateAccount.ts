import { AccountPage, CreateAccountInput, CreateAccountResponse } from "@core/graphql/types";
import { CREATE_ACCOUNT } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { ACCOUNT_FIELDS } from "@core/graphql/fragment";

export const useCreateAccount = () => {
  return useMutation<{ createAccount: CreateAccountResponse }, { input: CreateAccountInput }>(
    CREATE_ACCOUNT, {
      update(cache, { data }) {
        if (data && (data.createAccount.__typename === 'Admin' || data.createAccount.__typename === 'Guest')) {
          cache.modify({
            fields: {
              accounts(existingAccountsRef, { readField }) {
                const newAccountRef = cache.writeFragment({
                  data: data.createAccount,
                  fragment: ACCOUNT_FIELDS
                });
                const existingAccounts = readField<AccountPage>('accounts', existingAccountsRef) ?? {
                  total: 0,
                  list: [],
                };

                return {
                  total: existingAccounts.total + 1,
                  list: [newAccountRef, ...existingAccounts.list],
                };
              }
            },
            broadcast: false,
          });
        }
      }
    }
  );
};
