import { gql } from '@apollo/client'

export const USER_BILLS_BY_MONTH_SUMMARY = gql`
  query userBillsByMonthSummary(
    $startMonth: String!
    $endMonth: String!
  ) {
    userBillsByMonthSummary(startMonth: $startMonth, endMonth: $endMonth) {
      month
      totalCount
      draftCount
      pendingCount
      approvedCount
      rejectedCount
      manualImportCount
    }
  }
`
