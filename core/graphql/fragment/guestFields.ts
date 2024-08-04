import { gql } from '@apollo/client'

export const GUEST_FIELDS = gql`
  fragment guestFields on Guest {
    id
    role
    actions
    email
    name
    hasSetPassword
    companyName
    user {
      id
      name
      contactEmail
    }
  }
`
