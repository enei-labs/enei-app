import { SIGN_IN } from '@core/graphql/mutations'
import { SignInResponse } from '@core/graphql/types'
import useMutation from '../useMutation'

export const useSignIn = () => {
  return useMutation<{ signIn: SignInResponse }, { email: string; password: string }>(
    SIGN_IN,
  )
}
