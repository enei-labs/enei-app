import { gql } from '@apollo/client'

export const REMOVE_USER_BILL_CONFIG = gql`
  mutation removeUserBillConfig($id: UUID!) {
    removeUserBillConfig(id: $id) {
      id
      __typename
    }
  }
`
