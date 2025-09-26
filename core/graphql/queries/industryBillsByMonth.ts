import { gql } from '@apollo/client'

export const INDUSTRY_BILLS_BY_MONTH = gql`
  query industryBillsByMonth(
    $startMonth: String!
    $endMonth: String!
  ) {
    industryBillsByMonth(startMonth: $startMonth, endMonth: $endMonth) {
      month
      bills {
        id
        name
        status
        powerPlantName
        powerPlantNumber
      }
    }
  }
`