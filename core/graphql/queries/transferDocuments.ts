import { gql } from '@apollo/client'
import { BASE_TRANSFER_DOCUMENT_FIELDS } from '@core/graphql/fragment'

export const TRANSFER_DOCUMENTS = gql`
  ${BASE_TRANSFER_DOCUMENT_FIELDS}
  query transferDocuments(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    transferDocuments(
      limit: $limit
      offset: $offset
      term: $term
    ) {
      total
      list {
        ...baseTransferDocumentFields
      }
    }
  }
`
