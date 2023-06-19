import { gql } from '@apollo/client'
import { TPC_BILL_FIELDS } from '../fragment'

export const TPC_BILL = gql`
  ${TPC_BILL_FIELDS}
  query tpcBill(
    $id: UUID!
  ) {
    tpcBill(
      id: $id
    ) {
      ...tpcBillFields
    }
  }
`
