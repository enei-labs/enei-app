import { Company, UpdateCompanyInput } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_COMPANY } from '@core/graphql/mutations'

export const useUpdateCompany = () => {
  return useMutation<{ updateCompany: Company }, { input: UpdateCompanyInput }>(
    UPDATE_COMPANY,
  )
}
