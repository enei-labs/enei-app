import { TransferDocument } from '@core/graphql/types';
import useQuery from '../useQuery';
import { TRANSFER_DOCUMENT } from '@core/graphql/queries';

export const useTransferDocument = (id: string) => {
  return useQuery<{ transferDocument: TransferDocument }>(TRANSFER_DOCUMENT, {
    variables: { id: id },
    skip: !id,
  })
}
