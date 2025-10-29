import { SEND_USER_BILL_EMAIL } from '@core/graphql/mutations/sendUserBillEmail';
import useMutation from '../useMutation';

interface SendUserBillEmailResponse {
  success: boolean;
  message?: string;
}

export const useSendUserBillEmail = () => {
  return useMutation<
    { sendUserBillEmail: SendUserBillEmailResponse },
    { userBillId: string }
  >(SEND_USER_BILL_EMAIL);
};
