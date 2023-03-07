import { gql } from "@apollo/client";

export const RESET_PASSWORD = gql`
  mutation resetPassword($token: ID!, $newPassword: String!) {
    resetPassword(token: $token, newPassword: $newPassword) {
      __typename
      ... on Success {
        id
        message
      }
      ...on PasswordResetExpiredError {
        id
        message
      }
    }
  }
`;
