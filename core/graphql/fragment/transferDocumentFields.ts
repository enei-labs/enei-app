import { gql } from '@apollo/client'

export const TRANSFER_DOCUMENT_FIELDS = gql`
  fragment transferDocumentFields on TransferDocument {
    id
    transferDocumentPowerPlants {
      powerPlant {
        id
      }

    }
    transferDocumentUsers {
      user {
        id
      }
      monthlyTransferDegree
      yearlyTransferDegree
    }
  }
`
