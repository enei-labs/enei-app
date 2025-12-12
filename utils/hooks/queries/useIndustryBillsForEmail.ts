import { IndustryBillForEmail } from '@core/graphql/types';
import useQuery from '../useQuery';
import { INDUSTRY_BILLS_FOR_EMAIL } from '@core/graphql/queries/industryBillsForEmail';

interface Options {
  skip?: boolean;
}

export const useIndustryBillsForEmail = (month: string, options?: Options) => {
  return useQuery<{ industryBillsForEmail: IndustryBillForEmail[] }>(INDUSTRY_BILLS_FOR_EMAIL, {
    variables: { month },
    skip: !month || options?.skip,
  });
};
