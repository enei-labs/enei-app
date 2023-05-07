
import { CreateTpcBillInput, TpcBill } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_TPC_BILL } from '@core/graphql/mutations';

export const useCreateTPCBill = () => {
  return useMutation<{ createTPCBill: TpcBill }, { input: CreateTpcBillInput }>(
    CREATE_TPC_BILL
  )
}
