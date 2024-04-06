
import { CreateTpcBillInput, TpcBill, TpcBillPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_TPC_BILL } from '@core/graphql/mutations';
import { TPC_BILLS } from '@core/graphql/queries';

export const useCreateTPCBill = () => {
  return useMutation<{ createTPCBill: TpcBill }, { input: CreateTpcBillInput }>(
    CREATE_TPC_BILL, {
      update(cache, { data }, { variables }) {
        if (data?.createTPCBill?.__typename === 'TPCBill') {
          const existingTpcBills = cache.readQuery<{ tpcBills: TpcBillPage }>({
            query: TPC_BILLS,
            variables: {
              offset: 0,
              limit: 10,
              transferDocumentId: variables?.input.transferDocumentId,
            },
          });

          if (existingTpcBills) {
            cache.writeQuery({
              query: TPC_BILLS,
              variables: {
                offset: 0,
                limit: 10,
                transferDocumentId: variables?.input.transferDocumentId,
              },
              data: {
                tpcBills: {
                  ...existingTpcBills.tpcBills,
                  total: existingTpcBills.tpcBills.total + 1,
                  list: [data.createTPCBill, ...existingTpcBills.tpcBills.list],
                },
              },
            });
          }
        }
      },
    }
  )
}
