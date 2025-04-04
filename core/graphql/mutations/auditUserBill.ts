import { gql } from "@apollo/client";

export const AUDIT_USER_BILL = gql`
  mutation auditUserBill($id: String!, $status: ElectricBillStatus!) {
    auditUserBill(id: $id, status: $status) {
      __typename
      id
      status
    }
  }
`;