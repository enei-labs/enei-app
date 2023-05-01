import { gql } from '@apollo/client'

export const DASHBOARD_FIELDS = gql`
  fragment dashboardFields on Dashboard {
    companyInfo {
      count
      totalDegree
      totalVolume
    }
  }
`
