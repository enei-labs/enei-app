import { gql } from "@apollo/client";

export const REMOVE_COMPANY = gql`
  mutation removeCompany($id: UUID!) {
    removeCompany(id: $id) {
      __typename
    }
  }
`;
