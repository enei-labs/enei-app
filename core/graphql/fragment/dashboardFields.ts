import { gql } from '@apollo/client'

export const DASHBOARD_FIELDS = gql`

  fragment dashboardFields on Dashboard {
    companyInfo {
      powerPlantCount
      totalDegree
      totalVolume
    }
    userInfo {
      count
      yearlyGrowth
      totalRequireDegree
    }
    userBillInfo {
      turnover
    }
    userContractInfo {
      userContractsExpiringSoon {
        id
        name
        serialNumber
        salesAt
        salesTo
      }
    }
  }
`
