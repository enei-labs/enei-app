import { gql } from '@apollo/client'

export const UPDATE_COMPANY = gql`
  mutation updateCompany($input: UpdateCompanyInput!) {
    updateCompany(input: $input) {
      __typename
    }
  }
`
