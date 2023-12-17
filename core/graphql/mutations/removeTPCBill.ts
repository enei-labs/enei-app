import { gql } from '@apollo/client'

export const REMOVE_TPC_BILL = gql`
  mutation removeTPCBill($id: UUID!) {
    removeTPCBill(id: $id) {
      id
      __typename
    }
  }
`
