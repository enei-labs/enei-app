import { CompanyPage } from '@core/graphql/types'
import { COMPANIES } from '@core/graphql/queries/companies'
import useQuery from '../useQuery'

interface Variables {
  offset?: number;
  limit?: number;
}

export const useCompanies = ({ skip = false, variables }: {
  skip?: boolean;
  variables?: Variables;
} = {} ) => {
  return useQuery<{ companies: CompanyPage }>(COMPANIES, {
    variables: variables,
    skip,
  })
}
