import { EmailConfig } from '@core/graphql/types';
import useQuery from '../useQuery';
import { EMAIL_CONFIG } from '@core/graphql/queries';

export const useEmailConfig = (options?: { fetchPolicy?: 'cache-first' | 'network-only' }) => {
  return useQuery<{ emailConfig: EmailConfig }>(EMAIL_CONFIG, {
    fetchPolicy: options?.fetchPolicy,
  })
}
