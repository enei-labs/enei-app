import { gql } from "@apollo/client";

export const SEND_INDUSTRY_BILL_EMAIL = gql`
  mutation SendIndustryBillEmail($industryBillId: String!) {
    sendIndustryBillEmail(industryBillId: $industryBillId) {
      success
      message
    }
  }
`;
