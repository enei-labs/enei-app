import { Company, CreateCompanyInput } from '@core/graphql/types'
import { CREATE_COMPANY } from '@core/graphql/mutations/createCompany'
import useMutation from '../useMutation'

export const useCreateCompany = () => {
  return useMutation<{ createCompany: Company }, { input: CreateCompanyInput }>(
    CREATE_COMPANY, {
      update(cache, { data }) {
        if (data?.createCompany?.__typename === 'Company') {
          // Use cache.modify to update companies list
          cache.modify({
            fields: {
              companies: (existingData = { total: 0, list: [] }) => {
                // Get reference to the newly created company
                const newCompanyRef = { __ref: cache.identify(data.createCompany) };
                
                return {
                  ...existingData,
                  total: existingData.total + 1,
                  list: [newCompanyRef, ...(existingData.list || [])]
                };
              }
            }
          });
        }
      },
    }
  )
}
