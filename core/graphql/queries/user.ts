import { gql } from '@apollo/client'
import { USER_FIELDS } from '../fragment'

export const USER = gql`
  ${USER_FIELDS}
  query user(
    $id: UUID!
  ) {
    user(
      id: $id
    ) {
      ...userFields
    }
  }
`
