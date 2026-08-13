import { gql } from '@apollo/client'

export const INDUSTRY_BILLS_BY_MONTH_SUMMARY = gql`
  query industryBillsByMonthSummary(
    $startMonth: String!
    $endMonth: String!
  ) {
    industryBillsByMonthSummary(startMonth: $startMonth, endMonth: $endMonth) {
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
