import { gql } from "@apollo/client";

export const SEND_RESET_PASSWORD_EMAIL = gql`
  mutation SendResetPasswordEmail($id: ID!) {
    sendResetPasswordEmail(id: $id) {
      __typename
      ... on Success {
        id
        message
      }
      ... on AccountNotFoundError {
        id
        message
      }
    }
  }
`;
