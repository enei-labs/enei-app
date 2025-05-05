import { CreateAccountInput, CreateAccountResponse } from "@core/graphql/types";
import { CREATE_ACCOUNT } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateAccount = () => {
  return useMutation<{ createAccount: CreateAccountResponse }, { input: CreateAccountInput }>(
    CREATE_ACCOUNT, {
      update(cache, { data }) {
        if (data && (data.createAccount.__typename === 'Admin' || data.createAccount.__typename === 'Guest')) {
          cache.modify({
            fields: {
              accounts: (existingData = { total: 0, list: [] }) => {
                // Get reference to the newly created account
                const newAccountRef = { __ref: cache.identify(data.createAccount) };
                
                return {
                  ...existingData,
                  total: existingData.total + 1,
                  list: [newAccountRef, ...(existingData.list || [])]
                };
              }
            }
          });
        }
      },
    }
  );
};
