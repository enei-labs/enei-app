import { gql } from '@apollo/client'
import { TRANSFER_DOCUMENT_FIELDS } from '@core/graphql/fragment'

export const TRANSFER_DOCUMENTS = gql`
  ${TRANSFER_DOCUMENT_FIELDS}
  query transferDocuments(
    $limit: Int = 10
    $offset: Int = 0
  ) {
    transferDocuments(
      limit: $limit
      offset: $offset
    ) {
      total
      list {
        ...transferDocumentFields
      }
    }
  }
`
