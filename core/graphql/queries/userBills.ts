import { gql } from '@apollo/client'
import { USER_BILL_BASE_FIELDS } from '../fragment'

export const USER_BILLS = gql`
  ${USER_BILL_BASE_FIELDS}
  query userBills(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
    $month: String
    $userBillConfigId: UUID
  ) {
    userBills(
      limit: $limit
      offset: $offset
      term: $term
      month: $month
      userBillConfigId: $userBillConfigId
    ) {
      total
      list {
        ...userBillBaseFields
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