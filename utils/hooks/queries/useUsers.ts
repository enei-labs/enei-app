import { UserPage } from "@core/graphql/types";
import useQuery from "../useQuery";
import { USERS } from "@core/graphql/queries/users";

interface Variables {
  offset?: number;
  limit?: number;
}

export const useUsers = ({ skip = false, variables }:{
  skip?: boolean;
  variables?: Variables;
} = {}) => {
  return useQuery<{ users: UserPage }>(USERS, {
    variables: variables,
    skip,
  });
};
