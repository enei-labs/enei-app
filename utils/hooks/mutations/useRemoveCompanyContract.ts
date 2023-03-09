import { CompanyContract } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_COMPANY_CONTRACT } from '@core/graphql/mutations';

export const useRemoveCompanyContract = () => {
  return useMutation<{ removeCompanyContract: CompanyContract }, { id: string }>(
    REMOVE_COMPANY_CONTRACT,
  )
}
