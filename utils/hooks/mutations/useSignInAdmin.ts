import { SIGN_IN_ADMIN } from '@core/graphql/mutations'
import { SignInAdminResponse } from '@core/graphql/types'
import useMutation from '../useMutation'

export const useSignInAdmin = () => {
  return useMutation<{ signInAdmin: SignInAdminResponse }, { email: string; password: string }>(
    SIGN_IN_ADMIN,
  )
}
