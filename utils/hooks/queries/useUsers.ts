import { UserPage } from "@core/graphql/types";
import useQuery from "../useQuery";
import { BASE_USERS, USERS } from "@core/graphql/queries/users";

interface Variables {
  offset?: number;
  limit?: number;
}

export const useUsers = ({ skip = false, variables, onlyBasicInformation = false }:{
  skip?: boolean;
  variables?: Variables;
  onlyBasicInformation?: boolean,
} = {}) => {
  return useQuery<{ users: UserPage }>(onlyBasicInformation ? BASE_USERS : USERS, {
    variables: variables,
    skip,
  });
};
