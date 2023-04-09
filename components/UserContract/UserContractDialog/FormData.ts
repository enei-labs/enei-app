import { ElectricNumberInfo, UserType } from "@core/graphql/types";

export type FormData = {
  name: string;
  userType: UserType;
  serialNumber: string;
  purchaseDegree: number;
  price: number;
  upperLimit: number;
  lowerLimit: number;
  salesPeriod: string;
  transferAt: Date;
  contractDoc: string;
  electricNumberInfos: ElectricNumberInfo[];
};
