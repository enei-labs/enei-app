import { CompanyContract, CreateCompanyContractInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_COMPANY_CONTRACT } from '@core/graphql/mutations';

export const useCreateCompanyContract = () => {
  return useMutation<{ createCompanyContract: CompanyContract }, { input: CreateCompanyContractInput }>(
    CREATE_COMPANY_CONTRACT, {
      update(cache, { data }) {
        if (data?.createCompanyContract?.__typename === 'CompanyContract') {
          cache.modify({
            fields: {
              companyContracts: (existingData = { total: 0, list: [] }) => {
                // Get reference to the newly created contract
                const newContractRef = { __ref: cache.identify(data.createCompanyContract) };
                
                return {
                  ...existingData,
                  total: existingData.total + 1,
                  list: [newContractRef, ...(existingData.list || [])]
                };
              }
            }
          });
        }
      },
    }
  )
}
