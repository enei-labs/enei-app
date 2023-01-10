import { gql } from '@apollo/client'

export const SET_PASSWORD = gql`
  mutation setPassword($newPassword: String!) {
    setPassword(newPassword: $newPassword) {
      __typename
    }
  }
`
