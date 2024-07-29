import { gql } from '@apollo/client'

export const REMOVE_USER_CONTRACT = gql`
  mutation removeUserContract($id: UUID!) {
    removeUserContract(id: $id) {
      id
      __typename
    }
  }
`
