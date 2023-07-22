import { CompanyContract, CreateCompanyContractInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { CREATE_COMPANY_CONTRACT } from '@core/graphql/mutations';
import { COMPANY_CONTRACTS } from '@core/graphql/queries';

export const useCreateCompanyContract = () => {
  return useMutation<{ createCompanyContract: CompanyContract }, { input: CreateCompanyContractInput }>(
    CREATE_COMPANY_CONTRACT, {
      /** @need refactor */
      refetchQueries: [COMPANY_CONTRACTS]
    }
  )
}
