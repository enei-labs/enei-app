import { AccountPage } from "@core/graphql/types";
import { ACCOUNTS } from "@core/graphql/queries/accounts";
import useQuery from "../useQuery";

interface Variables {
  offset?: number;
  limit?: number;
}

export const useAccounts = (variables?: Variables) => {
  return useQuery<{ accounts: AccountPage }>(ACCOUNTS, {
    variables: variables,
  });
};
