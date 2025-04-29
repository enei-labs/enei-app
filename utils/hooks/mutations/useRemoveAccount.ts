import { REMOVE_ACCOUNT } from "@core/graphql/mutations";
import { RemoveAccountInput, Success } from "@core/graphql/types";
import useMutation from "../useMutation";

export const useRemoveAccount = () => {
  return useMutation<{ removeAccount: Success }, { input: RemoveAccountInput }>(
    REMOVE_ACCOUNT, {
      update(cache, { data }) {
        if (data?.removeAccount) {
          cache.evict({ id: cache.identify(data.removeAccount) });
          cache.gc();
        }
      },
    }
  );
};