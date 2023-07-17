import { gql } from '@apollo/client'

export const REMOVE_USER_BILL = gql`
  mutation removeUserBill($id: UUID!) {
    removeUserBill(id: $id) {
      __typename
    }
  }
`
