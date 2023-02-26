import { gql } from '@apollo/client'

export const CREATE_COMPANY_CONTRACT = gql`
  mutation createCompanyContract($input: CreateCompanyContractInput!) {
    createCompanyContract(input: $input) {
      __typename
    }
  }
`
