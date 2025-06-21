import { gql } from '@apollo/client'

export const COMPANY_CONTRACT_MONTHLY_TRANSFER_DEGREES = gql`
  query companyContractMonthlyTransferDegrees(
    $companyContractId: UUID!
    $startedAt: String
    $endedAt: String
  ) {
    companyContractMonthlyTransferDegrees(
      companyContractId: $companyContractId
      startedAt: $startedAt
      endedAt: $endedAt
    ) {
      monthlyTotals {
        month
        totalDegrees
      }
    }
  }
` 