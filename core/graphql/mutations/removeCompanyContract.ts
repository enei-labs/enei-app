import { gql } from '@apollo/client'

export const REMOVE_COMPANY_CONTRACT = gql`
  mutation removeCompanyContract($id: ID!) {
    removeCompanyContract(id: $id) {
      __typename
    }
  }
`
