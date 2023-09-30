import { ElectricNumberInfoInput, UserType } from "@core/graphql/types";

export type FormData = {
  name: string;
  userType: UserType;
  serialNumber: string;
  purchaseDegree: number;
  price: number;
  upperLimit: number;
  lowerLimit: number;
  salesAt: Date;
  salesPeriod: string;
  transferAt: Date;
  contractDoc: {
    file: File;
    id: string;
  };
  electricNumberInfos: ElectricNumberInfoInput[];
};
