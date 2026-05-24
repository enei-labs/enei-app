import { useMutation } from "@apollo/client";
import { AUDIT_INDUSTRY_BILLS } from "@core/graphql/mutations";

interface BatchAuditIndustryBillsResult {
  auditIndustryBills: {
    updatedCount: number;
  };
}

export const useAuditIndustryBills = () => {
  return useMutation<BatchAuditIndustryBillsResult, { ids: string[] }>(AUDIT_INDUSTRY_BILLS);
};
