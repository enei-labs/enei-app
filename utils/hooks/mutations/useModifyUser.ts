import { MODIFY_USER } from "@core/graphql/mutations";
import { ModifyUserInput, ModifyUserResponse } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyUser = () => {
  return useMutation<
    { modifyUser: ModifyUserResponse },
    { id: string; input: ModifyUserInput }
  >(MODIFY_USER);
};
