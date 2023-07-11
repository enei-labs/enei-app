import { CompanyContract, CompanyContractPage, CreateCompanyContractInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_COMPANY_CONTRACT } from '@core/graphql/mutations';
import { COMPANY_CONTRACT_FIELDS } from '@core/graphql/fragment';

export const useCreateCompanyContract = () => {
  return useMutation<{ createCompanyContract: CompanyContract }, { input: CreateCompanyContractInput }>(
    CREATE_COMPANY_CONTRACT, {
      update(cache, { data }) {
        if (data && data.createCompanyContract.__typename === 'CompanyContract') {
          cache.modify({
            fields: {
              companyContracts(companyContractPage: CompanyContractPage) {
                const newCompanyContract = cache.writeFragment({
                  data: data.createCompanyContract,
                  fragment: COMPANY_CONTRACT_FIELDS
                });

                return {
                  total: companyContractPage.total + 1,
                  list: [newCompanyContract, ...companyContractPage.list],
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
