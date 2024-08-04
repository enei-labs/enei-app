import { AccountPage, CreateAccountInput, CreateAccountResponse } from "@core/graphql/types";
import { CREATE_ACCOUNT } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { ACCOUNT_FIELDS } from "@core/graphql/fragment";

export const useCreateAccount = () => {
  return useMutation<{ createAccount: CreateAccountResponse }, { input: CreateAccountInput }>(
    CREATE_ACCOUNT, {
      update(cache, { data }) {
        if (data && (data.createAccount.__typename === 'Admin' || data.createAccount.__typename === 'Guest')) {
          const existingAccounts = cache.readQuery<{ accounts: AccountPage }>({ query: ACCOUNT_FIELDS });

          if (existingAccounts) {
            cache.writeQuery({
              query: ACCOUNT_FIELDS,
              variables: {
                limit: 10,
                offset: 0,
              },
              data: {
                accounts: {
                  ...existingAccounts.accounts,
                  total: existingAccounts.accounts.total + 1,
                  list: [data.createAccount, ...existingAccounts.accounts.list],
                },
              },
            });
          }
        }
      },
    }
  );
};
