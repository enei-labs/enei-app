import { CompanyContract, CompanyContractPage, CreateCompanyContractInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_COMPANY_CONTRACT } from '@core/graphql/mutations';
import { COMPANY_CONTRACTS } from '@core/graphql/queries';

export const useCreateCompanyContract = () => {
  return useMutation<{ createCompanyContract: CompanyContract }, { input: CreateCompanyContractInput }>(
    CREATE_COMPANY_CONTRACT, {
      update(cache, { data }) {
        if (data?.createCompanyContract?.__typename === 'CompanyContract') {
          const existingCompanyContracts = cache.readQuery<{ companyContracts: CompanyContractPage }>({ query: COMPANY_CONTRACTS });

          if (existingCompanyContracts) {
            cache.writeQuery({
              query: COMPANY_CONTRACTS,
              data: {
                companyContracts: {
                  ...existingCompanyContracts.companyContracts,
                  total: existingCompanyContracts.companyContracts.total + 1,
                  list: [data.createCompanyContract, ...existingCompanyContracts.companyContracts.list],
                },
              },
            });
          }
        }
      },
    }
  )
}
