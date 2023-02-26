import { Account } from "@core/graphql/types";

type State = {
  account?: Account
  status: 'edit' | 'create' | 'closed' | 'delete'
}

type Action =
  | { type: 'create' }
  | { type: 'edit'; payload: Account }
  | { type: 'delete'; payload: Account  }
  | { type: 'closed' }

export const reducer = (state: State, action: Action): State => {
  switch (action.type) {
    case 'edit':
      return { status: 'edit', account: action.payload }
    case 'create':
      return { status: 'create' }
    case 'closed':
      return { status: 'closed' }
    case 'delete':
        return { status: 'delete', account: action.payload }
    default:
      return { ...state }
  }
}
