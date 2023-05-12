import { gql } from "@apollo/client";

export const REMOVE_COMPANY = gql`
  mutation removeCompany($input: RemoveCompanyInput!) {
    removeCompany(input: $input) {
      __typename
    }
  }
`;
