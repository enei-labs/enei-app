import { gql } from '@apollo/client'
import { ADMIN_FIELDS, GUEST_FIELDS } from '../fragment'

export const SIGN_IN = gql`
  ${ADMIN_FIELDS}
  ${GUEST_FIELDS}
  mutation signIn($email: String!, $password: String!) {
    signIn(email: $email, password: $password) {
      ... on Admin {
        ...adminFields
      }

      ... on Guest {
        ...guestFields
      }

      ... on InvalidSignInInputError {
        message
      }
    }
  },
`
