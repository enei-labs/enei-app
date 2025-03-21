import { UpdateIndustryBillConfigInput, IndustryBillConfig } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_INDUSTRY_BILL_CONFIG } from '@core/graphql/mutations'
import { INDUSTRY_BILL_CONFIGS } from '@core/graphql/queries'

export const useUpdateIndustryBillConfig = () => {
  return useMutation<{ updateIndustryBillConfig: IndustryBillConfig }, { input: UpdateIndustryBillConfigInput }>(
    UPDATE_INDUSTRY_BILL_CONFIG,
    {
      refetchQueries: [INDUSTRY_BILL_CONFIGS],
    }
  )
}
