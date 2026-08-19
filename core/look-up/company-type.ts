import { CompanyType } from "@core/graphql/types";

export const CompanyTypeLookup = {
  [CompanyType.Company]: "公司",
  [CompanyType.Individual]: "個人",
};

export const companyTypeRadios = Object.values(CompanyType).map((value) => ({
  label: CompanyTypeLookup[value],
  value,
}));

/** 個人戶身分證字號遮罩顯示（個資保護）：A123456789 → A12****789 */
export const maskPersonalId = (value: string): string => {
  if (!value || value.length < 7) return value;
  return `${value.slice(0, 3)}****${value.slice(-3)}`;
};
