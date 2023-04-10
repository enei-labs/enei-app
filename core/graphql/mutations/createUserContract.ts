import { gql } from "@apollo/client";
import { USER_CONTRACT_FIELDS } from "../fragment";

export const CREATE_USER_CONTRACT = gql`
  ${USER_CONTRACT_FIELDS}
  mutation createUserContract($userId: String!, $input: CreateUserContractInput!) {
    createUserContract(userId: $userId, input: $input) {
      __typename
      ...userContractFields
    }
  }
`;
