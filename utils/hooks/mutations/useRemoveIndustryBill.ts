import { IndustryBill, IndustryBillPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_INDUSTRY_BILL } from '@core/graphql/mutations/removeIndustryBill';
import { INDUSTRY_BILLS } from '@core/graphql/queries';


export const useRemoveIndustryBill = () => {
  return useMutation<{ removeIndustryBill: IndustryBill }, { id: string }>(
    REMOVE_INDUSTRY_BILL, {
      update(cache, { data }) {
        if (data?.removeIndustryBill) {
          // Directly evict the industry bill from the cache
          cache.evict({ id: cache.identify(data.removeIndustryBill) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
