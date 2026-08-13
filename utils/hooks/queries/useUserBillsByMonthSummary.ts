import { USER_BILLS_BY_MONTH_SUMMARY } from "@core/graphql/queries";
import useQuery from "../useQuery";
import { BillsByMonthSummary } from "./useIndustryBillsByMonthSummary";

export type { BillsByMonthSummary } from "./useIndustryBillsByMonthSummary";

/** 每月用戶電費單統計（後端 SQL 聚合），取代載入整月帳單的 useUserBillsByMonth */
export const useUserBillsByMonthSummary = (
  startMonth: string,
  endMonth: string
) => {
  return useQuery<{ userBillsByMonthSummary: BillsByMonthSummary[] }>(
    USER_BILLS_BY_MONTH_SUMMARY,
    {
      variables: { startMonth, endMonth },
    }
  );
};
