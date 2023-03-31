import { gql } from '@apollo/client'
import { TRANSFER_DOCUMENT_FIELDS } from '@core/graphql/fragment'

export const UPDATE_TRANSFER_DOCUMENT = gql`
  ${TRANSFER_DOCUMENT_FIELDS}
  mutation updateTransferDocument($input: UpdateTransferDocumentInput!) {
    updateTransferDocument(input: $input) {
      __typename
      ...transferDocumentFields
    }
  }
`
