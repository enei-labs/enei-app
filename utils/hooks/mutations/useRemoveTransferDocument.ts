import { TransferDocument, TransferDocumentPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { TRANSFER_DOCUMENTS } from '@core/graphql/queries';
import { REMOVE_TRANSFER_DOCUMENT } from '@core/graphql/mutations';

interface TransferDocumentUpdateQuery {
  transferDocuments: TransferDocumentPage;
}

export const useRemoveTransferDocument = () => {
  return useMutation<{ removeTransferDocument: TransferDocument }, { id: string }>(
    REMOVE_TRANSFER_DOCUMENT, {
      /** @need refactor */
      refetchQueries: [TRANSFER_DOCUMENTS]
    }
  )
}
