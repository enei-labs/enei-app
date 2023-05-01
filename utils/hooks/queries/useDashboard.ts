import { Dashboard } from '@core/graphql/types';
import useQuery from '../useQuery';
import { DASHBOARD } from '@core/graphql/queries';

export const useDashboard = () => {
  return useQuery<{ dashboard: Dashboard }>(DASHBOARD)
}
