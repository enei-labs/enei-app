import { gql } from '@apollo/client'
import { USER_FIELDS } from '../fragment'

export const USER_BILLS = gql`
  ${USER_FIELDS}
  query userBills(
    $limit: Int = 10
    $offset: Int = 0
  ) {
    userBills(
      limit: $limit
      offset: $offset
    ) {
      total
      list {
        ...userBillFields
      }
    }
  }
`