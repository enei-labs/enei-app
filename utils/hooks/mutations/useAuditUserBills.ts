import { useMutation } from "@apollo/client";
import { AUDIT_USER_BILLS } from "@core/graphql/mutations";

interface BatchAuditUserBillsResult {
  auditUserBills: {
    updatedCount: number;
  };
}

export const useAuditUserBills = () => {
  return useMutation<BatchAuditUserBillsResult, { ids: string[] }>(AUDIT_USER_BILLS);
};
