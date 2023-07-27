import { gql } from '@apollo/client'

export const UPDATE_COMPANY_CONTRACT = gql`
  mutation updateCompanyContract($input: UpdateCompanyContractInput!) {
    updateCompanyContract(input: $input) {
      __typename
    }
  }
`
