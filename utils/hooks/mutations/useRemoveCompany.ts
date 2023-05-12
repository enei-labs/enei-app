import { REMOVE_COMPANY } from "@core/graphql/mutations"
import { COMPANIES } from "@core/graphql/queries"
import { Company } from "@core/graphql/types"
import useMutation from "@utils/hooks/useMutation"

export const useRemoveCompany = () => {
  return useMutation<{ removeCompany: Company }, { id: string }>(
    REMOVE_COMPANY, {
      /** @need refactor */
      refetchQueries: [COMPANIES]
    }
  )
}
