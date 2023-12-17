import { TpcBill, TpcBillPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { TPC_BILLS } from '@core/graphql/queries';
import { REMOVE_TPC_BILL } from '@core/graphql/mutations/removeTPCBill';

export const useRemoveTPCBill = () => {
  return useMutation<{ removeTPCBill: TpcBill }, { id: string }>(
    REMOVE_TPC_BILL, {
      update(cache, { data }) {
        if (data?.removeTPCBill?.__typename === 'TPCBill') {
          const existingTpcBills = cache.readQuery<{ tpcBills: TpcBillPage }>({ query: TPC_BILLS });

          if (existingTpcBills) {
            cache.writeQuery({
              query: TPC_BILLS,
              data: {
                tpcBills: {
                  ...existingTpcBills.tpcBills,
                  total: existingTpcBills.tpcBills.total - 1,
                  list: existingTpcBills.tpcBills.list.filter(user => user.id !== data.removeTPCBill.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
