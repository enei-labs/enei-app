import { gql } from "@apollo/client";

export const SEND_INDUSTRY_BILL_EMAIL = gql`
  mutation SendIndustryBillEmail(
    $industryBillId: String!
    $pdfContent: String
    $fileName: String
    $forceResend: Boolean
  ) {
    sendIndustryBillEmail(
      industryBillId: $industryBillId
      pdfContent: $pdfContent
      fileName: $fileName
      forceResend: $forceResend
    ) {
      success
      message
    }
  }
`;
