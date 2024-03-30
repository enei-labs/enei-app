import { TransferDocument, TransferDocumentPage, UpdateTransferDocumentStageInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { UPDATE_TRANSFER_DOCUMENT_STAGE } from '@core/graphql/mutations';

export const useUpdateTransferDocumentStage = () => {
  return useMutation<{ updateTransferDocumentStage: TransferDocument }, { id: string, moveNextStep: boolean, input: UpdateTransferDocumentStageInput }>(
    UPDATE_TRANSFER_DOCUMENT_STAGE
  )
}

export const useForwardTransferDocumentStage = (id: string) => {
  const [forward, { loading }] = useUpdateTransferDocumentStage();

  return [(date: Date, number?: string, companyContractId?: string) => forward({ variables: { id, moveNextStep: true, input: { date, number, companyContractId }, }}), loading] as const;
}

export const useBackwardTransferDocumentStage = (id: string) => {
  const [forward, { loading }] = useUpdateTransferDocumentStage();

  return [() => forward({ variables: { id, moveNextStep: false, input: { date: new Date() } }}), loading] as const;
}
