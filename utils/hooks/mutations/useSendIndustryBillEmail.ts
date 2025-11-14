import { SEND_INDUSTRY_BILL_EMAIL } from '@core/graphql/mutations/sendIndustryBillEmail';
import useMutation from '../useMutation';

interface SendIndustryBillEmailResponse {
  success: boolean;
  message?: string;
}

export interface SendIndustryBillEmailVariables {
  industryBillId: string;
  pdfContent?: string;
  fileName?: string;
}

export const useSendIndustryBillEmail = () => {
  return useMutation<
    { sendIndustryBillEmail: SendIndustryBillEmailResponse },
    SendIndustryBillEmailVariables
  >(SEND_INDUSTRY_BILL_EMAIL);
};
