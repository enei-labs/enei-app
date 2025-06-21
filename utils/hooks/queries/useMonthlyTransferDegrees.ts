import useQuery from '../useQuery';
import { gql } from '@apollo/client';

const MONTHLY_TPC_BILL_TRANSFER_DEGREES = gql`
  query MonthlyTpcTransferDegrees {
    dashboard {
      tpcBillInfo {
        monthlyTPCBillTransferDegrees
      }
    }
  }
`

export const useMonthlyTransferDegrees = () => {
  return useQuery<{ dashboard: {
    tpcBillInfo: {
      monthlyTPCBillTransferDegrees: number[]
    }
  } }>(MONTHLY_TPC_BILL_TRANSFER_DEGREES)
}
