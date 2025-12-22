import { gql } from '@apollo/client'

export const INDUSTRY_BILLS_FOR_EMAIL = gql`
  query industryBillsForEmail($month: String!, $term: String) {
    industryBillsForEmail(month: $month, term: $term) {
      id
      status
      billSource
      hasOriginalFile
      powerPlantName
      powerPlantNumber
      industry {
        id
        name
      }
    }
  }
`
