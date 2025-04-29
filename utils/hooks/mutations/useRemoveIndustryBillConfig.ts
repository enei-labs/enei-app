import { IndustryBillConfig, IndustryBillConfigPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_INDUSTRY_BILL_CONFIG } from '@core/graphql/mutations/removeIndustryBillConfig';
import { INDUSTRY_BILL_CONFIGS } from '@core/graphql/queries';


export const useRemoveIndustryBillConfig = () => {
  return useMutation<{ removeIndustryBillConfig: IndustryBillConfig }, { id: string }>(
    REMOVE_INDUSTRY_BILL_CONFIG, {
      update(cache, { data }) {
        if (data?.removeIndustryBillConfig) {
          cache.evict({ id: cache.identify(data.removeIndustryBillConfig) });
          cache.gc();
        }
      },
    }
  )
}
