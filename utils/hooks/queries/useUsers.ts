import { useEffect, useState } from "react";
import debounce from "lodash/debounce";
import { UserPage } from "@core/graphql/types";
import useQuery from "../useQuery";
import { BASE_USERS, USERS } from "@core/graphql/queries/users";

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
}

export const useUsers = ({
  skip = false,
  variables,
  onlyBasicInformation = false,
  debounceTime = 300
}: {
  skip?: boolean;
  variables?: Variables;
  onlyBasicInformation?: boolean,
  debounceTime?: number,
} = {}) => {
  const [debouncedTerm, setDebouncedTerm] = useState(variables?.term);

  // When the 'term' variable changes, call the debounced function
  useEffect(() => {
    // Create a debounced function inside the effect
    const debouncedSetTerm = debounce((newTerm) => setDebouncedTerm(newTerm), debounceTime);

    // Call the debounced function
    debouncedSetTerm(variables?.term);

    // Cleanup: cancel the debounced function if the component is unmounted
    return () => {
      debouncedSetTerm.cancel();
    };
  }, [variables?.term, debounceTime]);


  // Query users with the debounced term
  return useQuery<{ users: UserPage }>(onlyBasicInformation ? BASE_USERS : USERS, {
    variables: { ...variables, term: debouncedTerm },
    skip,
  });
};
