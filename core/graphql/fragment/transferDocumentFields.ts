import { gql } from '@apollo/client'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment/powerPlants'
import { USER_CONTRACT_FIELDS } from '@core/graphql/fragment/userContractFields'
import { USER_FIELDS } from '@core/graphql/fragment/userFields'

export const BASE_TRANSFER_DOCUMENT_FIELDS = gql`
  fragment baseTransferDocumentFields on TransferDocument {
    id
    name
    number
    receptionAreas
    expectedTime
    printingDoc
    replyDoc
    wordDoc
    formalDoc
  }
`

export const TRANSFER_DOCUMENT_FIELDS = gql`
  ${BASE_TRANSFER_DOCUMENT_FIELDS}
  ${POWER_PLANT_FIELDS}
  ${USER_FIELDS}
  ${USER_CONTRACT_FIELDS}
  fragment transferDocumentFields on TransferDocument {
    ...baseTransferDocumentFields
    transferDocumentPowerPlants {
      transferRate
      estimateAnnualSupply
      powerPlant {
        ...powerPlantFields
      }
    }
    transferDocumentUsers {
      user {
        ...userFields
      }
      userContract {
        ...userContractFields
      }
      monthlyTransferDegree
      yearlyTransferDegree
      expectedYearlyPurchaseDegree
    }
  }
`
