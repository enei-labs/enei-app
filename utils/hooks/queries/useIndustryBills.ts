import { IndustryBillPage, ElectricBillStatus, BillSource } from '@core/graphql/types';
import useQuery from '../useQuery';
import { INDUSTRY_BILLS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
  month?: string;
  industryBillConfigId?: string;
  statuses?: ElectricBillStatus[];
  billSources?: BillSource[];
}

interface Options {
  skip?: boolean;
}

export const useIndustryBills = (variables?: Variables, options?: Options) => {
  return useQuery<{ industryBills: IndustryBillPage }>(INDUSTRY_BILLS, {
    variables: variables,
    skip: options?.skip,
  })
}
