import { gql } from '@apollo/client'
import { TPC_BILL_FIELDS } from '@core/graphql/fragment'

export const TPC_BILLS = gql`
  ${TPC_BILL_FIELDS}
  query tpcBills(
    $transferDocumentId: UUID!
    $limit: Int = 10
    $offset: Int = 0
  ) {
    tpcBills(
      transferDocumentId: $transferDocumentId
      limit: $limit
      offset: $offset
    ) {
      total
      list {
        ...tpcBillFields
      }
    }
  }
`
