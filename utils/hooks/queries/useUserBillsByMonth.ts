import { USER_BILLS_BY_MONTH } from "@core/graphql/queries/userBillsByMonth";
import useQuery from "../useQuery";

export const useUserBillsByMonth = (startDate: Date, endDate: Date) => {
  return useQuery(USER_BILLS_BY_MONTH, {
    variables: { startDate, endDate },
  });
};