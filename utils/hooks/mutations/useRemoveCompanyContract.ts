import { CompanyContract, CompanyContractPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_COMPANY_CONTRACT } from '@core/graphql/mutations';
import { COMPANY_CONTRACTS } from '@core/graphql/queries';

export const useRemoveCompanyContract = () => {
  return useMutation<{ removeCompanyContract: CompanyContract }, { id: string }>(
    REMOVE_COMPANY_CONTRACT, {
      update(cache, { data }) {
        if (data?.removeCompanyContract?.__typename === 'CompanyContract') {
          const existingCompanyContracts = cache.readQuery<{ companyContracts: CompanyContractPage }>({ query: COMPANY_CONTRACTS });

          if (existingCompanyContracts) {
            cache.writeQuery({
              query: COMPANY_CONTRACTS,
              data: {
                companyContracts: {
                  ...existingCompanyContracts.companyContracts,
                  total: existingCompanyContracts.companyContracts.total - 1,
                  list: existingCompanyContracts.companyContracts.list.filter(user => user.id !== data.removeCompanyContract.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
