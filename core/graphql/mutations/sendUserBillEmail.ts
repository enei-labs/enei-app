import { gql } from "@apollo/client";

export const SEND_USER_BILL_EMAIL = gql`
  mutation SendUserBillEmail(
    $userBillId: String!
    $pdfContent: String
    $fileName: String
  ) {
    sendUserBillEmail(
      userBillId: $userBillId
      pdfContent: $pdfContent
      fileName: $fileName
    ) {
      success
      message
    }
  }
`;
