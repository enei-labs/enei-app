import { USER_STATS } from '@core/graphql/queries';
import useQuery from '../useQuery';

export const useUserStats = () => {
  return useQuery(USER_STATS);
};
