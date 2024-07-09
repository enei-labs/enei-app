import { MODIFY_PROFILE } from "@core/graphql/mutations";
import { Account, RecipientAccountInput } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyProfile = () => {
  return useMutation<
    { modifyProfile: Account },
    { name?: string; email?: string; recipientAccounts?: RecipientAccountInput[] }
  >(MODIFY_PROFILE);
};
