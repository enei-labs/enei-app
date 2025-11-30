import { gql } from "@apollo/client";

export const SEND_USER_BILLS_EMAIL = gql`
  mutation SendUserBillsEmail($month: String!, $isTestMode: Boolean) {
    sendUserBillsEmail(month: $month, isTestMode: $isTestMode) {
      success
      message
      batchId
      totalJobs
    }
  }
`;
