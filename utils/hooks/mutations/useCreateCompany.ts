import { Company, CompanyPage, CreateCompanyInput } from '@core/graphql/types'
import { CREATE_COMPANY } from '@core/graphql/mutations/createCompany'
import useMutation from '../useMutation'
import { COMPANY_FIELDS } from '@core/graphql/fragment'

export const useCreateCompany = () => {
  return useMutation<{ createCompany: Company }, { input: CreateCompanyInput }>(
    CREATE_COMPANY, {
      update(cache, { data }) {
        if (data && data.createCompany.__typename === 'Company') {
          cache.modify({
            fields: {
              companies(companyPage: CompanyPage) {
                const newCompany = cache.writeFragment({
                  data: data.createCompany,
                  fragment: COMPANY_FIELDS
                });

                return {
                  total: companyPage.total + 1,
                  list: [newCompany, ...companyPage.list],
                };
              }
            },
            broadcast: false,
          });
        }
      }
    }
  )
}
