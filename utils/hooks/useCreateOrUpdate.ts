import { ApolloCache, DefaultContext, MutationTuple } from '@apollo/client';
type mutationHookType = () => MutationTuple<any, any, DefaultContext, ApolloCache<any>>

const useCreateOrUpdate = (variant: "create" | "edit", createHook: mutationHookType, updateHook: mutationHookType) => {
  const [createFn, { loading }] = createHook();
  const [updateFn, { loading: updateLoading }] = updateHook();

  return [createFn, updateFn, variant === "create" ? loading : updateLoading] as const;
};

export default useCreateOrUpdate;