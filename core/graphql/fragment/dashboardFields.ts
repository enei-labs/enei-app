import { gql } from '@apollo/client'

export const DASHBOARD_FIELDS = gql`
  fragment dashboardFields on Dashboard {
    companyInfo {
      totalCompanies
      totalPowerPlants
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
      remainingDemandFromUserContracts {
        id
        name
        capacity
      }
    }
    transferDegreeInfo {
      monthlyTransferDegree
    }
    companyContractInfo {
      remainingDemandFromCompanyContracts {
        id
        name
        capacity
      }
    }
  }
`
