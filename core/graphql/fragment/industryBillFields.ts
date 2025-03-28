import { gql } from '@apollo/client'

export const INDUSTRY_BILL_FIELDS = gql`
  fragment industryBillFields on IndustryBill {
    id
    name
    electricNumberInfos {
      number
      price
    }
    billingDate
  }
`;