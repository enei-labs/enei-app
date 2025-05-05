import { CreateIndustryBillConfigInput, IndustryBillConfig } from "@core/graphql/types";
import { CREATE_INDUSTRY_BILL_CONFIG } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateIndustryBillConfig = () => {
  return useMutation<
    { createIndustryBillConfig: IndustryBillConfig },
    { input: CreateIndustryBillConfigInput }
  >(CREATE_INDUSTRY_BILL_CONFIG, {
    update(cache, { data }) {
      if (data?.createIndustryBillConfig?.__typename === 'IndustryBillConfig') {
        cache.modify({
          fields: {
            industryBillConfigs: (existingData = { total: 0, list: [] }) => {
              // Get reference to the newly created config
              const newConfigRef = { __ref: cache.identify(data.createIndustryBillConfig) };
              
              return {
                ...existingData,
                total: existingData.total + 1,
                list: [newConfigRef, ...(existingData.list || [])]
              };
            }
          }
        });
      }
    },
  });
};
