import { UserBillConfigPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { USER_BILL_CONFIGS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
}

export const useUserBillConfigs = (variables?: Variables) => {
  return useQuery<{ userBillConfigs: UserBillConfigPage }>(USER_BILL_CONFIGS, {
    variables: variables,
  })
}
