                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                                        import { CompanyContract, CompanyContractPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_COMPANY_CONTRACT } from '@core/graphql/mutations';
import { COMPANY_CONTRACTS } from '@core/graphql/queries';

export const useRemoveCompanyContract = () => {
  return useMutation<{ removeCompanyContract: CompanyContract }, { id: string }>(
    REMOVE_COMPANY_CONTRACT, {
      update(cache, { data }) {
        if (data?.removeCompanyContract) {
          // Directly evict the company contract from the cache
          cache.evict({ id: cache.identify(data.removeCompanyContract) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
