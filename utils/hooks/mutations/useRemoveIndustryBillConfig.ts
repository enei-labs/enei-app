import { IndustryBillConfig, IndustryBillConfigPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_INDUSTRY_BILL_CONFIG } from '@core/graphql/mutations/removeIndustryBillConfig';
import { INDUSTRY_BILL_CONFIGS } from '@core/graphql/queries';


export const useRemoveIndustryBillConfig = () => {
  return useMutation<{ removeIndustryBillConfig: IndustryBillConfig }, { id: string }>(
    REMOVE_INDUSTRY_BILL_CONFIG, {
      update(cache, { data }) {
        if (data?.removeIndustryBillConfig?.__typename === 'IndustryBillConfig') {
          const existingIndustryBillConfigs = cache.readQuery<{ industryBillConfigs: IndustryBillConfigPage }>({ query: INDUSTRY_BILL_CONFIGS, variables: { offset: 0, limit: 10 } });

          if (existingIndustryBillConfigs) {
            cache.writeQuery({
              query: INDUSTRY_BILL_CONFIGS,
              variables: { offset: 0, limit: 10 },
              data: {
                industryBills: {
                  ...existingIndustryBillConfigs.industryBillConfigs,
                  total: existingIndustryBillConfigs.industryBillConfigs.total - 1,
                  list: existingIndustryBillConfigs.industryBillConfigs.list.filter(industry => industry.id !== data.removeIndustryBillConfig.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
