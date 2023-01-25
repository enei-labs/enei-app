import { Company, CreateCompanyInput } from '@core/graphql/types'
import { CREATE_COMPANY } from '@core/graphql/mutations/createCompany'
import useMutation from '../useMutation'

export const useCreateCompany = () => {
  return useMutation<{ createCompany: Company }, { input: CreateCompanyInput }>(
    CREATE_COMPANY,
  )
}
