import { SEND_INDUSTRY_BILL_EMAIL } from '@core/graphql/mutations/sendIndustryBillEmail';
import useMutation from '../useMutation';

interface SendIndustryBillEmailResponse {
  success: boolean;
  message?: string;
}

export const useSendIndustryBillEmail = () => {
  return useMutation<
    { sendIndustryBillEmail: SendIndustryBillEmailResponse },
    { industryBillId: string }
  >(SEND_INDUSTRY_BILL_EMAIL);
};
