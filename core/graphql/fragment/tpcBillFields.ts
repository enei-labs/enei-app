import { gql } from '@apollo/client'

export const TPC_BILL_FIELDS = gql`
  fragment tpcBillFields on TPCBill {
    id
    billNumber
    billReceivedDate
    billingDate
    billDoc
    transferDegrees {
      id
      electricNumber
      degree
      user {
        id
        name
      }
      powerPlant {
        id
        name
        number
      }
      createdAt
    }
  }
`
