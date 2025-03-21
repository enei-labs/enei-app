import { CreateIndustryBillConfigInput, IndustryBillConfig, IndustryBillConfigPage } from "@core/graphql/types";
import { CREATE_INDUSTRY_BILL_CONFIG } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { INDUSTRY_BILL_CONFIGS } from "@core/graphql/queries";

export const useCreateIndustryBillConfig = () => {
  return useMutation<
    { createIndustryBillConfig: IndustryBillConfig },
    { input: CreateIndustryBillConfigInput }
  >(CREATE_INDUSTRY_BILL_CONFIG, {
    update(cache, { data }) {
      if (data?.createIndustryBillConfig?.__typename === 'IndustryBillConfig') {
        const existingIndustryBillConfigs = cache.readQuery<{ industryBillConfigs: IndustryBillConfigPage }>({ query: INDUSTRY_BILL_CONFIGS, variables: { limit: 10, offset: 0 } });

        if (existingIndustryBillConfigs) {
          cache.writeQuery({
            query: INDUSTRY_BILL_CONFIGS,
            variables: { limit: 10, offset: 0 },
            data: {
              industryBillConfigs: {
                ...existingIndustryBillConfigs.industryBillConfigs,
                total: existingIndustryBillConfigs.industryBillConfigs.total + 1,
                list: [data.createIndustryBillConfig, ...existingIndustryBillConfigs.industryBillConfigs.list],
              },
            },
          });
        }
      }
    },
  });
};
