import { gql } from "@apollo/client";

export const REVERT_MANUAL_USER_BILL = gql`
  mutation revertManualUserBill($input: RevertManualUserBillInput!) {
    revertManualUserBill(input: $input) {
      __typename
      id
      status
      billSource
    }
  }
`;
