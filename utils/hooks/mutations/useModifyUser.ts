import { MODIFY_USER } from "@core/graphql/mutations";
import { CreateUserInput, ModifyUserResponse } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useModifyUser = () => {
  return useMutation<
    { modifyUser: ModifyUserResponse },
    { id: string; input: CreateUserInput }
  >(MODIFY_USER);
};
