import { gql } from '@apollo/client'
import { INDUSTRY_BILL_BASE_FIELDS } from '../fragment'

export const INDUSTRY_BILLS = gql`
  ${INDUSTRY_BILL_BASE_FIELDS}
  query industryBills(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
    $month: String
    $industryBillConfigId: UUID
  ) {
    industryBills(
      limit: $limit
      offset: $offset
      term: $term
      month: $month
      industryBillConfigId: $industryBillConfigId
    ) {
      total
      list {
        ...industryBillBaseFields
      }
      statusCounts {
        approvedCount
        pendingCount
        draftCount
        rejectedCount
      }
    }
  }
`