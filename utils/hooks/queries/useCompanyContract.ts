import { CompanyContract } from '@core/graphql/types'
import useQuery from '../useQuery'
import { COMPANY_CONTRACT } from '@core/graphql/queries/companyContract';

export const useCompanyContract = (id: string) => {
  return useQuery<{ companyContract: CompanyContract }>(COMPANY_CONTRACT, {
    variables: { id: id },
    skip: !id,
  })
}
