import { gql } from '@apollo/client'
import { USER_FIELDS } from '../fragment'

export const USERS = gql`
  ${USER_FIELDS}
  query users(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    users(
      limit: $limit
      offset: $offset
      term: $term
    ) {
      total
      list {
        ...userFields
      }
    }
  }
`

export const BASE_USERS = gql`
  query baseUsers(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    users(
      limit: $limit
      offset: $offset
      term: $term
    ) {
      total
      list {
        id
        name
        contactEmail
        contactName
      }
    }
  }
`
