import { ContractTimeType, ElectricNumberInfoInput, UserType } from "@core/graphql/types";

export type FormData = {
  name: string;
  userType: UserType;
  serialNumber: string;
  purchaseDegree: number;
  price: number;
  upperLimit: number;
  lowerLimit: number;
  salesAt: Date;
  salesTo: Date;
  salesPeriod: string;
  transferAt: Date;
  contractDoc: {
    file: File;
    id: string;
  };
  contractDocName: string;
  contractTimeType: {
    label: string;
    value: ContractTimeType;
  };
  electricNumberInfos: ElectricNumberInfoInput[];
};
