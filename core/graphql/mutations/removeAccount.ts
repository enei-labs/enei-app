import { gql } from "@apollo/client";

export const REMOVE_ACCOUNT = gql`
  mutation removeAccount($input: RemoveAccountInput!) {
    removeAccount(input: $input) {
      __typename
    }
  }
`;
