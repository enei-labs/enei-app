import { CompanyPage, PowerPlant } from '@core/graphql/types'
import { COMPANIES, COMPANIES_WITH_POWER_PLANTS } from '@core/graphql/queries/companies'
import useQuery from '../useQuery'

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
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

type CompanyAllData = {
  total: number;
  list: {
    id: string;
    name: string;
    companyContracts: {
      id: string;
      name: string;
      number: string;
      powerPlants: PowerPlant[]
    }[]
  }[]
}

export const useFetchCompaniesAllData = () => {
  return useQuery<{ companies: CompanyAllData }>(COMPANIES_WITH_POWER_PLANTS)
}
