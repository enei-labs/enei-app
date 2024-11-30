import { TransferDocumentPage } from '@core/graphql/types';
import useQuery from '../useQuery';
import { TRANSFER_DOCUMENTS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  term?: string;
}

export const useTransferDocuments = (variables?: Variables) => {
  return useQuery<{ transferDocuments: TransferDocumentPage }>(TRANSFER_DOCUMENTS, {
    variables: variables,
  })
}
