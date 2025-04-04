import { ElectricBillStatus } from "@core/graphql/types";

export const ReviewStatusLookup = {
  [ElectricBillStatus.Draft]: "未產生",
  [ElectricBillStatus.Approved]: "已審核",
  [ElectricBillStatus.Manual]: "手動匯入",
  [ElectricBillStatus.Pending]: "待審核",
  [ElectricBillStatus.Rejected]: "已拒絕",
};
