import { gql } from "@apollo/client";
import { USER_FIELDS } from "../fragment";

export const CREATE_USER = gql`
  ${USER_FIELDS}
  mutation createUser($input: CreateUserInput!) {
    createUser(input: $input) {
      __typename
      ...userFields
    }
  }
`;
