import { CreateUserBillConfigInput, UserBillConfig } from "@core/graphql/types";
import { CREATE_USER_BILL_CONFIG } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateUserBillConfig = () => {
  return useMutation<
    { createUserBillConfig: UserBillConfig },
    { input: CreateUserBillConfigInput }
  >(CREATE_USER_BILL_CONFIG, {
    update(cache, { data }) {
      if (data?.createUserBillConfig?.__typename === 'UserBillConfig') {
        cache.modify({
          fields: {
            userBillConfigs: (existingData = { total: 0, list: [] }) => {
              // Get reference to the newly created config
              const newConfigRef = { __ref: cache.identify(data.createUserBillConfig) };
              
              return {
                ...existingData,
                total: existingData.total + 1,
                list: [newConfigRef, ...(existingData.list || [])]
              };
            }
          }
        });
      }
    },
  });
};
