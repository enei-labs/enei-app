
import { CREATE_TRANSFER_DOCUMENT } from "@core/graphql/mutations";
import { CreateTransferDocumentInput, TransferDocument, TransferDocumentPage } from "@core/graphql/types";
import useMutation from "../useMutation";
import { TRANSFER_DOCUMENTS } from "@core/graphql/queries";

export const useCreateTransferDocument = () => {
  return useMutation<
    { createTransferDocument: TransferDocument },
    { input: CreateTransferDocumentInput}
  >(CREATE_TRANSFER_DOCUMENT, {
    update(cache, { data }) {
      if (data?.createTransferDocument?.__typename === 'TransferDocument') {
        const existingTransferDocuments = cache.readQuery<{ transferDocuments: TransferDocumentPage }>({ query: TRANSFER_DOCUMENTS, variables: { limit: 10, offset: 0 } });

        if (existingTransferDocuments) {
          cache.writeQuery({
            query: TRANSFER_DOCUMENTS,
            variables: { limit: 10, offset: 0 },
            data: {
              transferDocuments: {
                ...existingTransferDocuments.transferDocuments,
                total: existingTransferDocuments.transferDocuments.total + 1,
                list: [data.createTransferDocument, ...existingTransferDocuments.transferDocuments.list],
              },
            },
          });
        }
      }
    },
  });
};
