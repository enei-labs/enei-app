import { gql } from '@apollo/client'

export const UPDATE_COMPANY = gql`
  mutation updateCompany($input: UpdateCompany!) {
    updateCompany(input: $input) {
      __typename
    }
  }
`
