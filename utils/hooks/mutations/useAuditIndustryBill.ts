import { useMutation } from "@apollo/client";
import { AUDIT_INDUSTRY_BILL } from "@core/graphql/mutations";
import { ElectricBillStatus, IndustryBill } from "@core/graphql/types";

export const useAuditIndustryBill = () => {
  return useMutation<{ auditIndustryBill: IndustryBill}, { id: string, status: ElectricBillStatus }>(AUDIT_INDUSTRY_BILL);
};
