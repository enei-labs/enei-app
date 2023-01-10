type State = {
  me?: any
  status: 'loading' | 'authenticated' | 'unauthenticated'
}

type Action =
  | { type: 'loading' }
  | { type: 'authenticated'; payload: any }
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
