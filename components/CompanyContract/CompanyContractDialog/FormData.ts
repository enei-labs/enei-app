import { ContractTimeType } from "@core/graphql/types";

export type FormData = {
  companyName: string;
  name: string;
  number: string;
  price: string;
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
  contractDoc: { id: string; file: File };
  transferDoc: { id: string; file: File };
  industryDoc: { id: string; file: File };
};