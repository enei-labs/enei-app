import { CreateUserInput, User } from "@core/graphql/types";
import { CREATE_USER } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateUser = () => {
  return useMutation<
    { createUser: User },
    { input: CreateUserInput }
  >(CREATE_USER);
};
