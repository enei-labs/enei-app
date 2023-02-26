import { gql } from "@apollo/client";

export const REMOVE_ACCOUNT = gql`
  mutation removeAccount($id: ID!) {
    removeAccount(id: $id) {
      __typename
    }
  }
`;
