import { gql } from "@apollo/client";

export const REVERT_MANUAL_INDUSTRY_BILL = gql`
  mutation revertManualIndustryBill($input: RevertManualIndustryBillInput!) {
    revertManualIndustryBill(input: $input) {
      __typename
      id
      status
      billSource
    }
  }
`;
