import { useMutation } from "@apollo/client";
import { REVERT_MANUAL_USER_BILL } from "@core/graphql/mutations";
import { UserBill } from "@core/graphql/types";

interface RevertManualUserBillInput {
  userBillId: string;
}

export const useRevertManualUserBill = () => {
  return useMutation<
    { revertManualUserBill: UserBill },
    { input: RevertManualUserBillInput }
  >(REVERT_MANUAL_USER_BILL);
};
