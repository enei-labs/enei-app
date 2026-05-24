import { gql } from "@apollo/client";

export const AUDIT_INDUSTRY_BILLS = gql`
  mutation auditIndustryBills($ids: [String!]!) {
    auditIndustryBills(ids: $ids) {
      updatedCount
    }
  }
`;
