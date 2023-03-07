import { gql } from "@apollo/client";

export const REQUEST_RESET_PASSWORD = gql`
  mutation requestResetPassword($id: ID!, $oldPassword: String!) {
    requestResetPassword(id: $id, oldPassword: $oldPassword) {
      __typename
      ...on PasswordReset {
        id
      }
    }
  }
`;
