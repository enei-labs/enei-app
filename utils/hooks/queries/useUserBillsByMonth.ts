import { USER_BILLS_BY_MONTH } from "@core/graphql/queries/userBillsByMonth";
import useQuery from "../useQuery";

export const useUserBillsByMonth = (startMonth: string, endMonth: string) => {
  return useQuery(USER_BILLS_BY_MONTH, {
    variables: { startMonth, endMonth },
  });
};