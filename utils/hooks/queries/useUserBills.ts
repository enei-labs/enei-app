import { UserBillPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { USER_BILLS } from '@core/graphql/queries';
import { useMemo } from 'react';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
  month?: string;
  userBillConfigId?: string;
}

export const useUserBills = (variables?: Variables) => {
  return useQuery<{ userBills: UserBillPage }>(USER_BILLS, {
    variables: variables,
  });
};
