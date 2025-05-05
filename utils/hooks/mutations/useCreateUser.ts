import { CreateUserInput, User } from "@core/graphql/types";
import { CREATE_USER } from "@core/graphql/mutations";
import useMutation from "../useMutation";

export const useCreateUser = () => {
  return useMutation<{ createUser: User }, { input: CreateUserInput }>(CREATE_USER, {
    update(cache, { data }) {
      if (data?.createUser?.__typename === 'User') {
        // Update users list using cache.modify
        cache.modify({
          fields: {
            users: (existingData = { total: 0, list: [] }) => {
              // Get reference to the newly created user
              const newUserRef = { __ref: cache.identify(data.createUser) };
              
              return {
                ...existingData,
                total: existingData.total + 1,
                list: [newUserRef, ...(existingData.list || [])]
              };
            },
            
            // Update dashboard count
            dashboard: (existingDashboard = {}) => {
              if (!existingDashboard.userInfo) {
                return existingDashboard;
              }
              
              return {
                ...existingDashboard,
                userInfo: {
                  ...existingDashboard.userInfo,
                  count: (existingDashboard.userInfo.count || 0) + 1
                }
              };
            }
          }
        });
      }
    },
  });
};
