import { CREATE_ADMIN } from '@core/graphql/mutations'
import { CreateAdminInput, CreateAdminResponse } from '@core/graphql/types'
import useMutation from '../useMutation'

export const useCreateAdmin = () => {
  return useMutation<{ createAdmin: CreateAdminResponse }, { input: CreateAdminInput }>(
    CREATE_ADMIN,
  )
}
