import { gql } from "@apollo/client";

export const AUDIT_USER_BILLS = gql`
  mutation auditUserBills($ids: [String!]!) {
    auditUserBills(ids: $ids) {
      updatedCount
    }
  }
`;
