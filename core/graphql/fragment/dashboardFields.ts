import { gql } from '@apollo/client'

export const DASHBOARD_FIELDS = gql`
  fragment dashboardFields on Dashboard {
    companyInfo {
      totalCompanies
      totalPowerPlants
      totalVolume
      averagePurchasePrice
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
      averageSellingPrice
      userContractsExpiringSoon {
        id
        name
        serialNumber
        salesAt
        salesTo
        user {
          id
          name
        }
      }
      remainingDemandFromUserContracts {
        id
        name
        capacity
        user {
          id
          name
        }
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
