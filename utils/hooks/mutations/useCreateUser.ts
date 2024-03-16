import { CreateUserInput, Dashboard, User, UserPage } from "@core/graphql/types";
import { CREATE_USER } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { DASHBOARD, USERS } from "@core/graphql/queries";

export const useCreateUser = () => {
  return useMutation<{ createUser: User }, { input: CreateUserInput }>(CREATE_USER, {
    update(cache, { data }) {
      if (data?.createUser?.__typename === 'User') {
        const existingUsers = cache.readQuery<{ users: UserPage }>({ query: USERS });
        const existingDashboard = cache.readQuery<{ dashboard: Dashboard }>({ query: DASHBOARD });

        if (existingUsers) {
          cache.writeQuery<{ users: UserPage }>({
            query: USERS,
            data: {
              users: {
                ...existingUsers.users,
                total: existingUsers.users.total + 1,
                list: [data.createUser, ...existingUsers.users.list],
              },
            },
          });
        }

        if (existingDashboard) {
          cache.writeQuery<{ dashboard: Dashboard }>({
            query: DASHBOARD,
            data: {
              dashboard: {
              ...existingDashboard.dashboard,
                userInfo: {
                  ...existingDashboard.dashboard.userInfo,
                  count: existingDashboard.dashboard.userInfo.count + 1,
                }
              }
            }
          })
        }
      }
    },
  });
};
