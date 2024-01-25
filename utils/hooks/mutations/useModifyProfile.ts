import { MODIFY_PROFILE } from "@core/graphql/mutations";
import { Account, UpdateRecipientAccountInput } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyProfile = () => {
  return useMutation<
    { modifyProfile: Account },
    { name?: string; email?: string; recipientAccounts?: UpdateRecipientAccountInput[] }
  >(MODIFY_PROFILE);
};
