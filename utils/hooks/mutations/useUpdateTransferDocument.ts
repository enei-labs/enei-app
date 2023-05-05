import { TransferDocument, TransferDocumentPage, UpdateTransferDocumentInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { UPDATE_TRANSFER_DOCUMENT } from '@core/graphql/mutations';

interface TransferDocumentUpdateQuery {
  transferDocuments: TransferDocumentPage;
}

export const useUpdateTransferDocument = () => {
  return useMutation<{ updateTransferDocument: TransferDocument }, { id: string, input: UpdateTransferDocumentInput }>(
    UPDATE_TRANSFER_DOCUMENT
  )
}
