import { INDUSTRY_BILLS_BY_MONTH } from "@core/graphql/queries";
import useQuery from "../useQuery";

export const useIndustryBillsByMonth = (startMonth: string, endMonth: string) => {
  return useQuery(INDUSTRY_BILLS_BY_MONTH, {
    variables: { startMonth, endMonth },
  });
};