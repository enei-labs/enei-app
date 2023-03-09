import { CompanyContract, CreateCompanyContractInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_COMPANY_CONTRACT } from '@core/graphql/mutations';

export const useCreateCompanyContract = () => {
  return useMutation<{ createCompanyContract: CompanyContract }, { input: CreateCompanyContractInput }>(
    CREATE_COMPANY_CONTRACT,
  )
}
