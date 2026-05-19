import { USER_CONTRACTS_WITH_REMAINING_DEMAND } from '@core/graphql/queries';
import useQuery from '../useQuery';

export const useUserContractsWithRemainingDemand = () => {
  return useQuery(USER_CONTRACTS_WITH_REMAINING_DEMAND);
};
