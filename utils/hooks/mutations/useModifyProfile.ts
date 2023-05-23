import { MODIFY_PROFILE } from "@core/graphql/mutations";
import { Success, UpdateRecipientAccountInput } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyProfile = () => {
  return useMutation<
    { modifyProfile: Success },
    { name?: string; email?: string; recipientAccounts?: UpdateRecipientAccountInput[] }
  >(MODIFY_PROFILE);
};
