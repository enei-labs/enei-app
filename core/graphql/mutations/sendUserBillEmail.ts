import { gql } from "@apollo/client";

export const SEND_USER_BILL_EMAIL = gql`
  mutation SendUserBillEmail($userBillId: String!) {
    sendUserBillEmail(userBillId: $userBillId) {
      success
      message
    }
  }
`;
