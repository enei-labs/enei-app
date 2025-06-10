import { UserBillPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { USER_BILLS } from '@core/graphql/queries';
import { useMemo } from 'react';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
  month?: string;
}

const formatDateToString = (date: Date) => {
  const year = date.getFullYear();
  const month = date.getMonth() + 1;
  return `${year}-${month.toString().padStart(2, "0")}`;
};

export const useUserBills = (variables?: Variables) => {
  const queryVariables = useMemo(() => {
    if (!variables?.month) return variables;

    const currentMonth = new Date(variables.month);
    const previousMonth = new Date(currentMonth.getFullYear(), currentMonth.getMonth() - 1, 1);
    const previousMonthString = formatDateToString(previousMonth);
    return { ...variables, month: previousMonthString };
  }, [variables]);

  return useQuery<{ userBills: UserBillPage }>(USER_BILLS, {
    variables: queryVariables,
  });
};
