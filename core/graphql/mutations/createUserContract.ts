import { gql } from "@apollo/client";
import { USER_FIELDS } from "../fragment";

export const CREATE_USER_CONTRACT = gql`
  ${USER_FIELDS}
  mutation createUserContract($input: CreateUserContractInput!) {
    createUserContract(input: $input) {
      __typename
      ...userFields
    }
  }
`;
