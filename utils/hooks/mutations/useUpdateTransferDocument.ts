import { TransferDocument, TransferDocumentPage, UpdateTransferDocumentInput } from '@core/graphql/types'
import useMutation from '../useMutation'
import { UPDATE_POWER_PLANT } from '@core/graphql/mutations'
import { POWER_PLANTS } from '@core/graphql/queries'

interface TransferDocumentUpdateQuery {
  transferDocuments: TransferDocumentPage;
}

export const useUpdateTransferDocument = () => {
  return useMutation<{ updateTransferDocument: TransferDocument }, { input: UpdateTransferDocumentInput }>(
    UPDATE_POWER_PLANT, {
      update(cache, { data }) {
        if (data && data.updateTransferDocument.__typename === 'TransferDocument') {
          cache.updateQuery({ query: POWER_PLANTS }, (originData: TransferDocumentUpdateQuery | null) => {
            if (!originData) return;
            const index = originData.transferDocuments.list.findIndex(p => p.id === data.updateTransferDocument.id)

            return ({
              transferDocuments: {
                total: originData.transferDocuments.total,
                list: [
                  ...originData.transferDocuments.list.slice(0, index),
                  data.updateTransferDocument,
                  ...originData.transferDocuments.list.slice(index + 1),
                ],
              }
          })});

        }
      }
    }
  )
}
