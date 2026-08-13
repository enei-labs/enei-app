import { INDUSTRY_BILLS_BY_MONTH_SUMMARY } from "@core/graphql/queries";
import useQuery from "../useQuery";

/** 每月電費單統計（後端 SQL 聚合），取代載入整月帳單的 useIndustryBillsByMonth */
export interface BillsByMonthSummary {
  month: string;
  totalCount: number;
  draftCount: number;
  pendingCount: number;
  approvedCount: number;
  rejectedCount: number;
  manualImportCount: number;
}

export const useIndustryBillsByMonthSummary = (
  startMonth: string,
  endMonth: string
) => {
  return useQuery<{ industryBillsByMonthSummary: BillsByMonthSummary[] }>(
    INDUSTRY_BILLS_BY_MONTH_SUMMARY,
    {
      variables: { startMonth, endMonth },
    }
  );
};
