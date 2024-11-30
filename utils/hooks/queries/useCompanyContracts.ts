import { CompanyContractPage } from '@core/graphql/types'
import { COMPANY_CONTRACTS } from '@core/graphql/queries/companyContracts'
import useQuery from '../useQuery'

interface Variables {
  offset?: number;
  limit?: number;
  companyId: string;
  term?: string;
}

export const useCompanyContracts = ( { skip = false, variables }: {
  skip?: boolean;
  variables?: Variables;
} = {} ) => {
  return useQuery<{ companyContracts: CompanyContractPage }>(COMPANY_CONTRACTS, {
    variables: variables,
    skip,
  })
}
