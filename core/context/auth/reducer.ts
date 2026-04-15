import { Account } from '@core/graphql/types'

type State = {
  me?: Account
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

type Action =
  | { type: 'loading' }
  | { type: 'authenticated'; payload: Account }
  | { type: 'unauthenticated' }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'loading':
      return { status: 'loading', me: undefined }
    case 'authenticated':
      return { status: 'authenticated', me: action.payload }
    case 'unauthenticated':
      return { status: 'unauthenticated', me: undefined }
    default:
      return { ...state }
  }
}
