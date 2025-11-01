import { gql } from "@apollo/client";

export const IMPORT_MANUAL_INDUSTRY_BILL = gql`
  mutation importManualIndustryBill($input: ImportManualIndustryBillInput!) {
    importManualIndustryBill(input: $input) {
      success
      billId
      message
    }
  }
`;
