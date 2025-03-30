import { gql } from '@apollo/client'

export const USER_BILLS_BY_MONTH = gql`
  query userBillsByMonth(
    $startDate: DateTime!
    $endDate: DateTime!
  ) {
    userBillsByMonth(startDate: $startDate, endDate: $endDate) {
      month
      bills {
        id
        status
      }
    }
  }
`