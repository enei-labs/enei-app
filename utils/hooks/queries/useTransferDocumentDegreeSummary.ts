import useQuery from "../useQuery";
import { TRANSFER_DOCUMENT_DEGREE_SUMMARY } from "@core/graphql/queries";

export interface TransferDocumentDegreeUserSummary {
  userId: string;
  userName: string;
  degree: number;
}

export interface TransferDocumentDegreeSummary {
  thisMonthDegree: number;
  lastMonthDegree: number;
  thisYearDegree: number;
  userSummaries: TransferDocumentDegreeUserSummary[];
}

/**
 * 轉供文件 × 電廠的轉供統計（後端 SQL 聚合）。
 * 取代抓整份文件所有 transferDegrees 到前端計算（曾造成 API 記憶體暴衝）。
 */
export const useTransferDocumentDegreeSummary = (
  transferDocumentId: string,
  powerPlantId: string | null
) => {
  return useQuery<{
    transferDocumentDegreeSummary: TransferDocumentDegreeSummary;
  }>(TRANSFER_DOCUMENT_DEGREE_SUMMARY, {
    variables: { transferDocumentId, powerPlantId },
    skip: !powerPlantId,
  });
};
