import { MODIFY_ACCOUNT } from "@core/graphql/mutations";
import { Success } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyAccount = () => {
  return useMutation<
    { modifyAccount: Success },
    { name?: string; email?: string; id?: string; companyId?: string }
  >(MODIFY_ACCOUNT);
};
