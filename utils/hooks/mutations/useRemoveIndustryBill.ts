import { IndustryBill, IndustryBillPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_INDUSTRY_BILL } from '@core/graphql/mutations/removeIndustryBill';
import { INDUSTRY_BILLS } from '@core/graphql/queries';


export const useRemoveIndustryBill = () => {
  return useMutation<{ removeIndustryBill: IndustryBill }, { id: string }>(
    REMOVE_INDUSTRY_BILL, {
      update(cache, { data }) {
        if (data?.removeIndustryBill?.__typename === 'IndustryBill') {
          const existingIndustryBills = cache.readQuery<{ industryBills: IndustryBillPage }>({ query: INDUSTRY_BILLS, variables: { offset: 0, limit: 10 } });

          if (existingIndustryBills) {
            cache.writeQuery({
              query: INDUSTRY_BILLS,
              variables: { offset: 0, limit: 10 },
              data: {
                industryBills: {
                  ...existingIndustryBills.industryBills,
                  total: existingIndustryBills.industryBills.total - 1,
                  list: existingIndustryBills.industryBills.list.filter(industry => industry.id !== data.removeIndustryBill.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
