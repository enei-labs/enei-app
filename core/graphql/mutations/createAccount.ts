import { gql } from "@apollo/client";
import { ACCOUNT_FIELDS } from "../fragment";

export const CREATE_ACCOUNT = gql`
  ${ACCOUNT_FIELDS}
  mutation createAccount($input: CreateAccountInput!) {
    createAccount(input: $input) {
      __typename
      ...accountFields
      ... on AccountAlreadyExistsError {
        id
        message
      }
    }
  }
`;
