import { AccountPage } from "@core/graphql/types";
import { ACCOUNTS } from "@core/graphql/queries/accounts";
import useQuery from "../useQuery";

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
}

export const useAccounts = (variables?: Variables) => {
  return useQuery<{ accounts: AccountPage }>(ACCOUNTS, {
    notifyOnNetworkStatusChange: false,
    variables: variables,
  });
};
