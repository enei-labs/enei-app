import { CreateIndustryBillInput, IndustryBill, IndustryBillPage } from "@core/graphql/types";
import { CREATE_INDUSTRY_BILL } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { INDUSTRY_BILLS } from "@core/graphql/queries";

export const useCreateIndustryBill = () => {
  return useMutation<
    { createIndustryBill: IndustryBill },
    { input: CreateIndustryBillInput }
  >(CREATE_INDUSTRY_BILL, {
    update(cache, { data }) {
      if (data?.createIndustryBill?.__typename === 'IndustryBill') {
        const existingIndustryBills = cache.readQuery<{ industryBills: IndustryBillPage }>({ query: INDUSTRY_BILLS, variables: { limit: 10, offset: 0 } });

        if (existingIndustryBills) {
          cache.writeQuery({
            query: INDUSTRY_BILLS,
            variables: { limit: 10, offset: 0 },
            data: {
              industryBills: {
                ...existingIndustryBills.industryBills,
                total: existingIndustryBills.industryBills.total + 1,
                list: [data.createIndustryBill, ...existingIndustryBills.industryBills.list],
              },
            },
          });
        }
      }
    },
  });
};
