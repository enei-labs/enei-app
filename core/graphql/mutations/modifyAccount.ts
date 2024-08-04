import { gql } from "@apollo/client";

export const MODIFY_ACCOUNT = gql`
  mutation modifyAccount(
    $name: String
    $email: String
    $id: ID!
    $companyId: ID
    $userId: ID
  ) {
    modifyAccount(name: $name, email: $email, id: $id, companyId: $companyId, userId: $userId) {
      __typename
    }
  }
`;
