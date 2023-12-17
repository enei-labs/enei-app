import { gql } from '@apollo/client'

export const REMOVE_COMPANY_CONTRACT = gql`
  mutation removeCompanyContract($id: UUID!) {
    removeCompanyContract(id: $id) {
      id
      __typename
    }
  }
`
