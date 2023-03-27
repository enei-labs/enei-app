import { CreateUserInput, CreateUserResponse } from "@core/graphql/types";
import { CREATE_USER } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateUser = () => {
  return useMutation<
    { createUser: CreateUserResponse },
    { input: CreateUserInput }
  >(CREATE_USER);
};
