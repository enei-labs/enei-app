import { CREATE_TRANSFER_DOCUMENT } from "@core/graphql/mutations";
import { CreateTransferDocumentInput, TransferDocument } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useCreateTransferDocument = () => {
  return useMutation<
    { createTransferDocument: TransferDocument },
    { input: CreateTransferDocumentInput}
  >(CREATE_TRANSFER_DOCUMENT, {
    update(cache, { data }) {
      if (data?.createTransferDocument?.__typename === 'TransferDocument') {
        cache.modify({
          fields: {
            transferDocuments: (existingData = { total: 0, list: [] }) => {
              // Get reference to the newly created document
              const newDocumentRef = { __ref: cache.identify(data.createTransferDocument) };
              
              return {
                ...existingData,
                total: existingData.total + 1,
                list: [newDocumentRef, ...(existingData.list || [])]
              };
            }
          }
        });
      }
    },
  });
};
