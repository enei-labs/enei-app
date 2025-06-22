import { gql } from '@apollo/client'

export const USER_CONTRACT_MONTHLY_TRANSFER_DEGREES = gql`
  query userContractMonthlyTransferDegrees(
    $userContractId: UUID!
    $startedAt: String
    $endedAt: String
  ) {
    userContractMonthlyTransferDegrees(
      userContractId: $userContractId
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