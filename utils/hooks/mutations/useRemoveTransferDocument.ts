import { TransferDocument, TransferDocumentPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { REMOVE_TRANSFER_DOCUMENT } from '@core/graphql/mutations';

interface TransferDocumentUpdateQuery {
  transferDocuments: TransferDocumentPage;
}

export const useRemoveTransferDocument = () => {
  return useMutation<{ removeTransferDocument: TransferDocument }, { id: string }>(
    REMOVE_TRANSFER_DOCUMENT, {
      update(cache, { data }) {
        if (data?.removeTransferDocument) {
          cache.evict({ id: cache.identify(data.removeTransferDocument) });
          cache.gc();
        }
      },
    }
  )
}
