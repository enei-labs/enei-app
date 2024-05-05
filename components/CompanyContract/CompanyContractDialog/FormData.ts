import { ContractTimeType, RateType } from "@core/graphql/types";

export type FormData = {
  companyName: string;
  name: string;
  number: string;
  rateType: RateType;
  price?: string | null;
  contractTimeType: {
    label: string;
    value: ContractTimeType;
  };
  duration?: string;
  startedAt: Date;
  endedAt?: Date;
  transferRate: number;
  daysToPay: number;
  description: string;
  contractDoc: { id: string; file: Partial<File> };
  transferDoc: { id: string; file: Partial<File> };
  industryDoc: { id: string; file: Partial<File> };
};
