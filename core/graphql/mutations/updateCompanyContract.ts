import { gql } from '@apollo/client'

export const UPDATE_COMPANY_CONTRACT = gql`
  mutation updateCompanyContract($input: UpdateCompanyContract!) {
    updateCompanyContract(input: $input) {
      __typename
    }
  }
`
