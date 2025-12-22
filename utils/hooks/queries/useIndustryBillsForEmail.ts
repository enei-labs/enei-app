import { IndustryBillForEmail } from '@core/graphql/types';
import useQuery from '../useQuery';
import { INDUSTRY_BILLS_FOR_EMAIL } from '@core/graphql/queries/industryBillsForEmail';

interface Variables {
  month: string;
  term?: string;
}

interface Options {
  skip?: boolean;
}

export const useIndustryBillsForEmail = (variables: Variables, options?: Options) => {
  return useQuery<{ industryBillsForEmail: IndustryBillForEmail[] }>(INDUSTRY_BILLS_FOR_EMAIL, {
    variables,
    skip: !variables.month || options?.skip,
  });
};
