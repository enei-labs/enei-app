import { gql } from '@apollo/client'

export const INDUSTRY_BILLS_BY_MONTH = gql`
  query industryBillsByMonth(
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    industryBillsByMonth(startDate: $startDate, endDate: $endDate) {
      month
      bills {
        id
        status
      }
    }
  }
`