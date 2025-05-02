import { REMOVE_COMPANY } from "@core/graphql/mutations"
import { Company } from "@core/graphql/types"
import useMutation from "@utils/hooks/useMutation"

export const useRemoveCompany = () => {
  return useMutation<{ removeCompany: Company }, { id: string }>(
    REMOVE_COMPANY, {
      update(cache, { data }) {
        if (data?.removeCompany) {
          // Directly evict the company from the cache
          cache.evict({ id: cache.identify(data.removeCompany) });
          // Garbage collect any unreferenced objects
          cache.gc();
        }
      },
    }
  )
}
