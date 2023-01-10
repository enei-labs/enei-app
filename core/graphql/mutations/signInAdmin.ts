import { gql } from '@apollo/client'
import { ADMIN_FIELDS } from '../fragment'

export const SIGN_IN_ADMIN = gql`
  ${ADMIN_FIELDS}
  mutation signInAdmin($email: String!, $password: String!) {
    signInAdmin(email: $email, password: $password) {
      ... on Admin {
        ...adminFields
      }

      ... on InvalidSignInInputError {
        message
      }
    }
  }
`
