import { gql } from '@apollo/client'
import { INDUSTRY_BILL_FIELDS } from '../fragment'

export const INDUSTRY_BILLS = gql`
  ${INDUSTRY_BILL_FIELDS}
  query industryBills(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
    $month: String
  ) {
    industryBills(
      limit: $limit
      offset: $offset
      term: $term
      month: $month
    ) {
      total
      list {
        ...industryBillFields
      }
    }
  }
`