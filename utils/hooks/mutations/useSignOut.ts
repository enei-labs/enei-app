import { SIGN_OUT } from '@core/graphql/mutations'
import { Success } from '@core/graphql/types'
import useMutation from '../useMutation'

export const useSignOut = () => {
  return useMutation<{ signOut: Success }>(SIGN_OUT)
}
