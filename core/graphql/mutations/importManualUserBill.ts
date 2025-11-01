import { gql } from "@apollo/client";

export const IMPORT_MANUAL_USER_BILL = gql`
  mutation importManualUserBill($input: ImportManualUserBillInput!) {
    importManualUserBill(input: $input) {
      success
      billId
      message
    }
  }
`;
