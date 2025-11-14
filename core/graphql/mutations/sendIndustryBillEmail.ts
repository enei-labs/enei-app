import { gql } from "@apollo/client";

export const SEND_INDUSTRY_BILL_EMAIL = gql`
  mutation SendIndustryBillEmail(
    $industryBillId: String!
    $pdfContent: String
    $fileName: String
  ) {
    sendIndustryBillEmail(
      industryBillId: $industryBillId
      pdfContent: $pdfContent
      fileName: $fileName
    ) {
      success
      message
    }
  }
`;
