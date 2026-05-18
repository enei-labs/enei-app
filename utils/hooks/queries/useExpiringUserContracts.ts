import { EXPIRING_USER_CONTRACTS } from '@core/graphql/queries';
import useQuery from '../useQuery';

interface Variables {
  limit?: number;
}

export const useExpiringUserContracts = (variables?: Variables) => {
  return useQuery(EXPIRING_USER_CONTRACTS, { variables });
};
