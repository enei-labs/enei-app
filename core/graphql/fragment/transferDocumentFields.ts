import { gql } from '@apollo/client'
import { POWER_PLANTS_FIELDS } from '@core/graphql/fragment/powerPlants'
import { USER_FIELDS } from '@core/graphql/fragment/userFields'

export const TRANSFER_DOCUMENT_FIELDS = gql`
  ${POWER_PLANTS_FIELDS}
  ${USER_FIELDS}
  fragment transferDocumentFields on TransferDocument {
    id
    name
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
