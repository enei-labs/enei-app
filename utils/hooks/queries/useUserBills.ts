import { UserBillPage, ElectricBillStatus, BillSource } from '@core/graphql/types';
import useQuery from '../useQuery';
import { USER_BILLS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
  month?: string;
  userBillConfigId?: string;
  statuses?: ElectricBillStatus[];
  billSources?: BillSource[];
}

interface Options {
  skip?: boolean;
}

export const useUserBills = (variables?: Variables, options?: Options) => {
  return useQuery<{ userBills: UserBillPage }>(USER_BILLS, {
    variables: variables,
    skip: options?.skip,
  });
};
