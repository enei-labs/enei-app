import { gql } from '@apollo/client'

export const CREATE_COMPANY = gql`
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      __typename
    }
  }
`
