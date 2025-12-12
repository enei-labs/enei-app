import { gql } from '@apollo/client'
import { INDUSTRY_BILL_BASE_FIELDS } from '../fragment/industryBillFields'

export const INDUSTRY_BILLS_BY_MONTH = gql`
  ${INDUSTRY_BILL_BASE_FIELDS}
  query industryBillsByMonth(
    $startMonth: String!
    $endMonth: String!
  ) {
    industryBillsByMonth(startMonth: $startMonth, endMonth: $endMonth) {
      month
      bills {
        ...industryBillBaseFields
      }
    }
  }
`