import { SEND_USER_BILL_EMAIL } from '@core/graphql/mutations/sendUserBillEmail';
import useMutation from '../useMutation';

interface SendUserBillEmailResponse {
  success: boolean;
  message?: string;
}

export interface SendUserBillEmailVariables {
  userBillId: string;
  pdfContent?: string;
  fileName?: string;
}

export const useSendUserBillEmail = () => {
  return useMutation<
    { sendUserBillEmail: SendUserBillEmailResponse },
    SendUserBillEmailVariables
  >(SEND_USER_BILL_EMAIL);
};
