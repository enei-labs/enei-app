import { CompanyContractPage } from '@core/graphql/types'
import { COMPANY_CONTRACTS } from '@core/graphql/queries/companyContracts'
import useQuery from '../useQuery'

interface Variables {
  offset?: number;
  limit?: number;
  companyId: string;
}

export const useCompanyContracts = (variables?: Variables) => {
  return useQuery<{ companyContracts: CompanyContractPage }>(COMPANY_CONTRACTS, {
    variables: variables,
  })
}
