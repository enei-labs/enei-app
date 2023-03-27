import { gql } from "@apollo/client";
import { USER_FIELDS } from "@core/graphql/fragment";

export const MODIFY_USER = gql`
  ${USER_FIELDS}
  mutation modifyUser($id: UUID!, $input: ModifyUserInput!) {
    modifyUser(id: $id, input: $input) {
      __typename
      ...userFields
    }
  }
`;
