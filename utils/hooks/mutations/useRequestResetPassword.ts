import { REQUEST_RESET_PASSWORD } from "@core/graphql/mutations";
import { RequestResetPasswordResponse } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useRequestResetPassword = () => {
  return useMutation<{ requestResetPassword: RequestResetPasswordResponse }, { id: string, oldPassword: string }>(
    REQUEST_RESET_PASSWORD
  );
};
