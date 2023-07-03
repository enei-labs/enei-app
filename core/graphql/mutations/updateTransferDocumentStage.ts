import { gql } from '@apollo/client'
import { TRANSFER_DOCUMENT_FIELDS } from '@core/graphql/fragment'

export const UPDATE_TRANSFER_DOCUMENT_STAGE = gql`
  ${TRANSFER_DOCUMENT_FIELDS}
  mutation updateTransferDocumentStage($id: UUID!, $moveNextStep: Boolean!, $input: UpdateTransferDocumentStageInput!) {
    updateTransferDocumentStage(id: $id, moveNextStep: $moveNextStep, input: $input) {
      __typename
      ...transferDocumentFields
    }
  }
`
