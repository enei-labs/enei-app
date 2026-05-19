import { COMPANY_STATS } from '@core/graphql/queries';
import useQuery from '../useQuery';

export const useCompanyStats = () => {
  return useQuery(COMPANY_STATS);
};
