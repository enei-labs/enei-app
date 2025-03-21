import { UserBillConfig, UserBillConfigPage } from '@core/graphql/types';
import useMutation from '../useMutation';
import { USER_BILL_CONFIGS } from '@core/graphql/queries';
import { REMOVE_USER_BILL_CONFIG } from '@core/graphql/mutations/removeUserBillConfig';


export const useRemoveUserBillConfig = () => {
  return useMutation<{ removeUserBillConfig: UserBillConfig }, { id: string }>(
    REMOVE_USER_BILL_CONFIG, {
      update(cache, { data }) {
        if (data?.removeUserBillConfig?.__typename === 'UserBillConfig') {
          const existingUserBillConfigs = cache.readQuery<{ userBillConfigs: UserBillConfigPage }>({
            query: USER_BILL_CONFIGS, variables: { offset: 0, limit: 10 }
          });

          if (existingUserBillConfigs) {
            cache.writeQuery({
              query: USER_BILL_CONFIGS,
              variables: { offset: 0, limit: 10 },
              data: {
                userBillConfigs: {
                  ...existingUserBillConfigs.userBillConfigs,
                  total: existingUserBillConfigs.userBillConfigs.total - 1,
                  list: existingUserBillConfigs.userBillConfigs.list.filter(user => user.id !== data.removeUserBillConfig.id),
                },
              },
            });
          }
        }
      },
    }
  )
}
