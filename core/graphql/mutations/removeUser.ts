import { gql } from '@apollo/client'

export const REMOVE_USER = gql`
  mutation removeUser($id: UUID!) {
    removeUser(id: $id) {
      __typename
    }
  }
`
