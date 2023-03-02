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
              accounts(accountPage: AccountPage) {
                const newAccount = cache.writeFragment({
                  data: data.createAccount,
                  fragment: ACCOUNT_FIELDS
                });

                return {
                  total: accountPage.total + 1,
                  list: [...accountPage.list, newAccount],
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
