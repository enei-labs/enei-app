import { gql } from '@apollo/client'
import { USER_FIELDS } from '../fragment'

export const USERS = gql`
  ${USER_FIELDS}
  query users(
    $limit: Int = 10
    $offset: Int = 0
  ) {
    users(
      limit: $limit
      offset: $offset
    ) {
      total
      list {
        ...userFields
      }
    }
  }
`
