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
      update(cache, { data }) {
        if (data?.removeTransferDocument?.__typename === 'TransferDocument') {
          const existingTransferDocuments = cache.readQuery<{ transferDocuments: TransferDocumentPage }>({ query: TRANSFER_DOCUMENTS, variables: { limit: 10, offset: 0 } });

          if (existingTransferDocuments) {
            cache.writeQuery({
              query: TRANSFER_DOCUMENTS,
              variables: { limit: 10, offset: 0 },
              data: {
                transferDocuments: {
                  ...existingTransferDocuments.transferDocuments,
                  total: existingTransferDocuments.transferDocuments.total - 1,
                  list: existingTransferDocuments.transferDocuments.list.filter(user => user.id !== data.removeTransferDocument.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
