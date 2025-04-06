import { gql } from "@apollo/client";

export const AUDIT_INDUSTRY_BILL = gql`
  mutation auditIndustryBill($id: String!, $status: ElectricBillStatus!) {
    auditIndustryBill(id: $id, status: $status) {
      __typename
      id
      status
    }
  }
`;