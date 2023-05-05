import { gql } from '@apollo/client'

export const TPC_BILL_FIELDS = gql`
  fragment tpcBillFields on TPCBill {
    id
    billReceivedDate
    billDoc
    transferRecords {
      powerPlantId
      transferDegrees {
        id
        degree
        userContract {
          id
        }
        user {
          id
        }
        powerPlant {
          id
        }
      }
    }
  }
`
