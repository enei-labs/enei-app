import { gql } from '@apollo/client'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment/powerPlants'
import { USER_FIELDS } from '@core/graphql/fragment/userFields'

export const TRANSFER_DOCUMENT_FIELDS = gql`
  ${POWER_PLANT_FIELDS}
  ${USER_FIELDS}
  fragment transferDocumentFields on TransferDocument {
    id
    name
    number
    receptionAreas
    expectedTime
    printingDoc
    replyDoc
    wordDoc
    formalDoc
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
      monthlyTransferDegree
      yearlyTransferDegree
    }
  }
`
