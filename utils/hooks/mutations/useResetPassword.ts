import { RESET_PASSWORD } from "@core/graphql/mutations";
import { ResetPasswordResponse } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useResetPassword = () => {
  return useMutation<{ resetPassword: ResetPasswordResponse }, { token: string, newPassword: string }>(
    RESET_PASSWORD
  );
};
