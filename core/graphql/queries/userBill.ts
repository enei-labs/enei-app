import { gql } from '@apollo/client'
import { USER_BILL_FIELDS } from '../fragment'

export const USER_BILL = gql`
  ${USER_BILL_FIELDS}
  query userBill(
    $id: UUID!
  ) {
    userBill(
      id: $id
    ) {
      ...userBillFields
    }
  }
`
