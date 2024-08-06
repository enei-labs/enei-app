import { gql } from '@apollo/client'

export const TPC_BILL_FIELDS = gql`
  fragment tpcBillFields on TPCBill {
    id
    billReceivedDate
    billingDate
    billDoc
    transferDegrees {
      id
      degree
      userContract {
        id
        name
      }
      user {
        id
        name
      }
      powerPlant {
        id
        name
      }
      createdAt
    }
  }
`
