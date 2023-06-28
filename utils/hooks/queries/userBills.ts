import { UserBillPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { USER_BILLS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
}

export const useUserBills = (variables?: Variables) => {
  return useQuery<{ userBills: UserBillPage }>(USER_BILLS, {
    variables: variables,
  })
}
