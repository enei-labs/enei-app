import { IndustryBillConfigPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { INDUSTRY_BILL_CONFIGS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
}

export const useIndustryBillConfigs = (variables?: Variables) => {
  return useQuery<{ industryBillConfigs: IndustryBillConfigPage }>(INDUSTRY_BILL_CONFIGS, {
    variables: variables,
  })
}
