import { SET_PASSWORD } from '@core/graphql/mutations'
import { Admin } from '@core/graphql/types'
import useMutation from '../useMutation'

export const useSetPassword = () => {
  return useMutation<{ setPassword: Admin }, { newPassword: string }>(SET_PASSWORD)
}
