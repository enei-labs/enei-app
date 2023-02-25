import { REMOVE_ACCOUNT } from "@core/graphql/mutations";
import { Success } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useRemoveAccount = () => {
  return useMutation<{ removeAccount: Success }, { id: string }>(
    REMOVE_ACCOUNT
  );
};
