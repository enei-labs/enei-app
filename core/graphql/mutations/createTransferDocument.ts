import { gql } from '@apollo/client'
import { TRANSFER_DOCUMENT_FIELDS } from '@core/graphql/fragment'

export const CREATE_TRANSFER_DOCUMENT = gql`
  ${TRANSFER_DOCUMENT_FIELDS}
  mutation createTransferDocument($input: CreateTransferDocumentInput!) {
    createTransferDocument(input: $input) {
      __typename
      ...transferDocumentFields
    }
  }
`
