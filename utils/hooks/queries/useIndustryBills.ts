import { IndustryBillPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { INDUSTRY_BILLS } from '@core/graphql/queries';
import { useMemo } from 'react';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
  month?: string;
  industryBillConfigId?: string;
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
