import { gql } from '@apollo/client'

export const TRANSFER_DOCUMENT_DEGREE_SUMMARY = gql`
  query transferDocumentDegreeSummary(
    $transferDocumentId: UUID!
    $powerPlantId: UUID!
  ) {
    transferDocumentDegreeSummary(
      transferDocumentId: $transferDocumentId
      powerPlantId: $powerPlantId
    ) {
      thisMonthDegree
      lastMonthDegree
      thisYearDegree
      userSummaries {
        userId
        userName
        degree
      }
    }
  }
`
