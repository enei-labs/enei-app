import { gql } from '@apollo/client'
import { USER_BILL_FIELDS } from '../fragment'

export const USER_BILLS = gql`
  ${USER_BILL_FIELDS}
  query userBills(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    userBills(
      limit: $limit
      offset: $offset
      term: $term
    ) {
      total
      list {
        ...userBillFields
      }
    }
  }
`