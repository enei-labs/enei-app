import { gql } from '@apollo/client'
import { FEE_FIELDS, USER_BILL_FIELDS } from '../fragment'

export const USER_BILL = gql`
  ${FEE_FIELDS}
  ${USER_BILL_FIELDS}
  query userBill(
    $id: UUID!
  ) {
    userBill(
      id: $id
    ) {
      ...userBillFields
    }
    fee {
      ...feeFields
    }
  }
`
