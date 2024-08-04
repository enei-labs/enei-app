import { MODIFY_ACCOUNT } from "@core/graphql/mutations";
import { Account } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyAccount = () => {
  return useMutation<
    { modifyAccount: Account },
    {
      name?: string;
      email?: string;
      id?: string;
      companyId?: string;
      userId?: string;
    }
  >(MODIFY_ACCOUNT);
};
