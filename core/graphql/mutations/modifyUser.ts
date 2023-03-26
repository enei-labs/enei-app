import { gql } from "@apollo/client";

export const MODIFY_USER = gql`
  mutation modifyUser($id: UUID!, $input: ModifyUserInput!) {
    modifyUser(id: $id, input: $input) {
      __typename
    }
  }
`;
