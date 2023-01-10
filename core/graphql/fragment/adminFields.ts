import { gql } from '@apollo/client'

export const ADMIN_FIELDS = gql`
  fragment adminFields on Admin {
    role
    email
    hasSetPassword
  }
`
