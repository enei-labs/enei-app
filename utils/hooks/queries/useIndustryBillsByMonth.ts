import { INDUSTRY_BILLS_BY_MONTH } from "@core/graphql/queries";
import useQuery from "../useQuery";

export const useIndustryBillsByMonth = (startDate: Date, endDate: Date) => {
  return useQuery(INDUSTRY_BILLS_BY_MONTH, {
    variables: { startDate, endDate },
  });
};