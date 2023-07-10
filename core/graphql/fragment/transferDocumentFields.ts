import { gql } from '@apollo/client'
import { ELECTRIC_NUMBER_INFO_FIELDS } from '@core/graphql/fragment/electricNumberInfoFields'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment/powerPlants'
import { USER_CONTRACT_FIELDS } from '@core/graphql/fragment/userContractFields'

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
    planSubmissionDate
    responseAcquisitionDate
    contractReviewDate
    contractCompletionDate
    officialTransferDate
  }
`

export const TRANSFER_DOCUMENT_FIELDS = gql`
  ${BASE_TRANSFER_DOCUMENT_FIELDS}
  ${POWER_PLANT_FIELDS}
  ${USER_CONTRACT_FIELDS}
  ${ELECTRIC_NUMBER_INFO_FIELDS}
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
        id
        name
        estimatedTransferDegree
        expectedYearlyPurchaseDegree
      }
      userContract {
        ...userContractFields
      }
      monthlyTransferDegree
      yearlyTransferDegree
      expectedYearlyPurchaseDegree
      electricNumberInfo {
        ...electricNumberInfoFields
      }
    }
  }
`
