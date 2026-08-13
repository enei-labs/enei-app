import { gql } from '@apollo/client'

/**
 * 清單用精簡欄位：不含 transferDegrees。
 * 統計數字（totalDegree 等）由後端 SQL 聚合，
 * 避免一張帳單拖入數千筆轉供度數（曾造成 API 記憶體暴衝）。
 */
export const TPC_BILL_FIELDS = gql`
  fragment tpcBillFields on TPCBill {
    id
    billNumber
    billReceivedDate
    billingDate
    billDoc
    totalDegree
    uniqueUserCount
    uniquePowerPlantCount
  }
`

/** 單張帳單詳細頁用：含完整 transferDegrees，勿用於清單查詢 */
export const TPC_BILL_DETAIL_FIELDS = gql`
  ${TPC_BILL_FIELDS}
  fragment tpcBillDetailFields on TPCBill {
    ...tpcBillFields
    transferDegrees {
      id
      electricNumber
      degree
      user {
        id
        name
      }
      powerPlant {
        id
        name
        number
      }
      createdAt
    }
  }
`
