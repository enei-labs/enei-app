import { REMOVE_COMPANY } from "@core/graphql/mutations"
import { COMPANIES } from "@core/graphql/queries"
import { Company, CompanyPage } from "@core/graphql/types"
import useMutation from "@utils/hooks/useMutation"

export const useRemoveCompany = () => {
  return useMutation<{ removeCompany: Company }, { id: string }>(
    REMOVE_COMPANY, {
      update(cache, { data }) {
        if (data?.removeCompany?.__typename === 'Company') {
          const existingCompanies = cache.readQuery<{ companies: CompanyPage }>({ query: COMPANIES });

          if (existingCompanies) {
            cache.writeQuery({
              query: COMPANIES,
              data: {
                companies: {
                  ...existingCompanies.companies,
                  total: existingCompanies.companies.total - 1,
                  list: existingCompanies.companies.list.filter(user => user.id !== data.removeCompany.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
