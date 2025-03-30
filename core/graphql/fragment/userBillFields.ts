import { gql } from '@apollo/client'

export const USER_BILL_FIELDS = gql`
  fragment userBillFields on UserBill {
    id
    name
    electricNumberInfos {
      number
      price
    }
    billingDate
    status
  }
`;