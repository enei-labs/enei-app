import { COMPANY_CONTRACTS_WITH_REMAINING_CAPACITY } from '@core/graphql/queries';
import useQuery from '../useQuery';

export const useCompanyContractsWithRemainingCapacity = () => {
  return useQuery(COMPANY_CONTRACTS_WITH_REMAINING_CAPACITY);
};
