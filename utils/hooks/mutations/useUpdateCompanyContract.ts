import { CompanyContract, UpdateCompanyContractInput } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_COMPANY_CONTRACT } from '@core/graphql/mutations'
import { COMPANY_CONTRACT } from '@core/graphql/queries'

export const useUpdateCompanyContract = () => {
  return useMutation<{ updateCompanyContract: CompanyContract }, { input: UpdateCompanyContractInput }>(
    UPDATE_COMPANY_CONTRACT,
    {
      refetchQueries: [COMPANY_CONTRACT]
    }
  )
}
