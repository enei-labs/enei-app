import { gql } from '@apollo/client'
import { INDUSTRY_BILL_FIELDS } from '../fragment'

export const INDUSTRY_BILL = gql`
  ${INDUSTRY_BILL_FIELDS}
  query industryBill(
    $id: UUID!
  ) {
    industryBill(
      id: $id
    ) {
      ...industryBillFields
    }
  }
`
