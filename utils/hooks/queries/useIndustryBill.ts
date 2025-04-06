import {IndustryBill } from '@core/graphql/types'
import useQuery from '../useQuery'
import { INDUSTRY_BILL } from '@core/graphql/queries';

export const useIndustryBill = (id: string) => {
  return useQuery<{ industryBill: IndustryBill }>(INDUSTRY_BILL, {
    variables: { id: id },
    skip: !id,
  })
}
