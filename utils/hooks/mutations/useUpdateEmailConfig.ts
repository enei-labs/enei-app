import { EmailConfig, UpdateEmailConfigInput } from '@core/graphql/types';
import useMutation from '../useMutation';
import { UPDATE_EMAIL_CONFIG } from '@core/graphql/mutations';
import { EMAIL_CONFIG } from '@core/graphql/queries';

export const useUpdateEmailConfig = () => {
  return useMutation<{ updateEmailConfig: EmailConfig }, { input: UpdateEmailConfigInput }>(
    UPDATE_EMAIL_CONFIG, {
      refetchQueries: [EMAIL_CONFIG]
    }
  )
}
