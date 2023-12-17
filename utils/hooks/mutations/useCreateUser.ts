import { CreateUserInput, User, UserPage } from "@core/graphql/types";
import { CREATE_USER } from "@core/graphql/mutations";
import useMutation from "../useMutation";
import { USERS } from "@core/graphql/queries";

export const useCreateUser = () => {
  return useMutation<{ createUser: User }, { input: CreateUserInput }>(CREATE_USER, {
    update(cache, { data }) {
      if (data?.createUser?.__typename === 'User') {
        const existingUsers = cache.readQuery<{ users: UserPage }>({ query: USERS });

        if (existingUsers) {
          cache.writeQuery({
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
      }
    },
  });
};
