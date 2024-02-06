export type FormData = {
  name: string;
  companyAddress: string;
  notes?: string;
  contactName: string;
  contactPhone: string;
  contactEmail: string;
  bankAccounts: {
    bankCode: {
      label: string;
      value: string;
    };
    bankName: string;
    bankBranchCode: {
      label: string;
      value: string;
    };
    bankBranchName: string;
    accountName: string;
    account: string;
    taxId?: string;
  }[];
};
