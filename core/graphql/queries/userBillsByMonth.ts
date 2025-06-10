import { gql } from '@apollo/client'

export const USER_BILLS_BY_MONTH = gql`
  query userBillsByMonth(
    $startMonth: String!
    $endMonth: String!
  ) {
    userBillsByMonth(startMonth: $startMonth, endMonth: $endMonth) {
      month
      bills {
        id
        status
      }
    }
  }
`