import { gql } from '@apollo/client'

export const REMOVE_USER = gql`
  mutation removeUser($input: RemoveUserInput!) {
    removeUser(input: $input) {
      id
      __typename
    }
  }
`
