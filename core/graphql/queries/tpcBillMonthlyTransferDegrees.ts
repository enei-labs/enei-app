import { gql } from '@apollo/client'

export const TPC_BILL_MONTHLY_TRANSFER_DEGREES = gql`
  query tpcBillMonthlyTransferDegrees(
    $startedAt: String
    $endedAt: String
  ) {
    tpcBillMonthlyTransferDegrees(startedAt: $startedAt, endedAt: $endedAt) {
      monthlyTotals
    }
  }
` 