import { CreateUserBillConfigInput, UserBillConfig, UserBillConfigPage } from "@core/graphql/types";
import { CREATE_USER_BILL_CONFIG } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { USER_BILL_CONFIGS } from "@core/graphql/queries";

export const useCreateUserBillConfig = () => {
  return useMutation<
    { createUserBillConfig: UserBillConfig },
    { input: CreateUserBillConfigInput }
  >(CREATE_USER_BILL_CONFIG, {
    update(cache, { data }) {
      if (data?.createUserBillConfig?.__typename === 'UserBillConfig') {
        const existingUserBillConfigs = cache.readQuery<{ userBillConfigs: UserBillConfigPage }>({ query: USER_BILL_CONFIGS, variables: { limit: 10, offset: 0 } });

        if (existingUserBillConfigs) {
          cache.writeQuery({
            query: USER_BILL_CONFIGS,
            variables: { limit: 10, offset: 0 },
            data: {
              userBillConfigs: {
                ...existingUserBillConfigs.userBillConfigs,
                total: existingUserBillConfigs.userBillConfigs.total + 1,
                list: [data.createUserBillConfig, ...existingUserBillConfigs.userBillConfigs.list],
              },
            },
          });
        }
      }
    },
  });
};
