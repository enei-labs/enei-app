import { Company, CompanyPage, CreateCompanyInput } from '@core/graphql/types'
import { CREATE_COMPANY } from '@core/graphql/mutations/createCompany'
import useMutation from '../useMutation'
import { COMPANIES } from '@core/graphql/queries'

export const useCreateCompany = () => {
  return useMutation<{ createCompany: Company }, { input: CreateCompanyInput }>(
    CREATE_COMPANY, {
      update(cache, { data }) {
        if (data?.createCompany?.__typename === 'Company') {
          const existingCompanies = cache.readQuery<{ companies: CompanyPage }>({ query: COMPANIES });

          if (existingCompanies) {
            cache.writeQuery({
              query: COMPANIES,
              data: {
                companies: {
                  ...existingCompanies.companies,
                  total: existingCompanies.companies.total + 1,
                  list: [data.createCompany, ...existingCompanies.companies.list],
                },
              },
            });
          }
        }
      },
    }
  )
}
