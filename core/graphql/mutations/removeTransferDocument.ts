import { gql } from '@apollo/client'

export const REMOVE_TRANSFER_DOCUMENT = gql`
  mutation removeTransferDocument($id: UUID!) {
    removeTransferDocument(id: $id) {
      __typename
    }
  }
`
