import { useMutation } from "@apollo/client";
import { AUDIT_USER_BILL } from "@core/graphql/mutations";
import { ElectricBillStatus, UserBill } from "@core/graphql/types";

export const useAuditUserBill = () => {
  return useMutation<{ auditUserBill: UserBill}, { id: string, status: ElectricBillStatus }>(AUDIT_USER_BILL);
};
