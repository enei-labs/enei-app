import { gql } from "@apollo/client";

export const MODIFY_PROFILE = gql`
  mutation modifyProfile($name: String, $email: String, $recipientAccounts: [UpdateRecipientAccountInput!]) {
    modifyProfile(name: $name, email: $email, recipientAccounts: $recipientAccounts) {
      __typename
    }
  }
`;
