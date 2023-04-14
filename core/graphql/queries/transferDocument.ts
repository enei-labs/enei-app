import { gql } from '@apollo/client'
import { TRANSFER_DOCUMENT_FIELDS } from '../fragment'

export const TRANSFER_DOCUMENT = gql`
  ${TRANSFER_DOCUMENT_FIELDS}
  query transferDocument(
    $id: UUID!
  ) {
    transferDocument(
      id: $id
    ) {
      ...transferDocumentFields
    }
  }
`
