import { gql } from "@apollo/client";

export const MODIFY_PROFILE = gql`
  mutation modifyProfile($name: String, $email: String) {
    modifyProfile(name: $name, email: $email) {
      __typename
    }
  }
`;
