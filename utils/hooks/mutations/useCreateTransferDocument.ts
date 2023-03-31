
import { CREATE_TRANSFER_DOCUMENT } from "@core/graphql/mutations";
import { CreateTransferDocumentInput, TransferDocument } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useCreateTransferDocument = () => {
  return useMutation<
    { createTransferDocument: TransferDocument },
    { input: CreateTransferDocumentInput}
  >(CREATE_TRANSFER_DOCUMENT);
};
