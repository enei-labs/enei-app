import { gql } from '@apollo/client'
import { INDUSTRY_BILL_CONFIG_FIELDS } from '../fragment'

export const INDUSTRY_BILL_CONFIG = gql`
  ${INDUSTRY_BILL_CONFIG_FIELDS}
  query industryBillConfig(
    $id: UUID!
  ) {
    industryBill(
      id: $id
    ) {
      ...industryBillFields
    }
  }
`
