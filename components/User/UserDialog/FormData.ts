import { BankAccountInput } from "@core/graphql/types";

export type FormData = {
  name: string;
  companyAddress: string;
  notes?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  bankAccounts: BankAccountInput[];
};
