import { IndustryBillPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { INDUSTRY_BILLS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
  month?: string;
}

export const useIndustryBills = (variables?: Variables) => {
  return useQuery<{ industryBills: IndustryBillPage }>(INDUSTRY_BILLS, {
    variables: variables,
  })
}
