import { gql } from '@apollo/client'

export const REMOVE_USER = gql`
  mutation removeUser($id: UUID!) {
    removePowerPlant(id: $id) {
      __typename
    }
  }
`
