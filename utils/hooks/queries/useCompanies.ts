import { CompanyPage } from '@core/graphql/types'
import { COMPANIES } from '@core/graphql/queries/companies'
import useQuery from '../useQuery'

interface Variables {
  offset?: number;
  limit?: number;
}

export const useCompanies = (variables?: Variables) => {
  return useQuery<{ companies: CompanyPage }>(COMPANIES, {
    variables: variables,
  })
}
