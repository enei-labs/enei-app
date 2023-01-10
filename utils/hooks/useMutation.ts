import type {
  ApolloCache,
  DefaultContext,
  DocumentNode,
  MutationHookOptions,
  MutationTuple,
  OperationVariables,
  TypedDocumentNode,
} from '@apollo/client'
import { useMutation as apolloMutation } from '@apollo/client'
import { toast } from 'react-toastify'

const useMutation = <
  TData = any,
  TVariables = OperationVariables,
  TContext = DefaultContext,
  TCache extends ApolloCache<any> = ApolloCache<any>,
>(
  mutation: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: MutationHookOptions<TData, TVariables, TContext>,
): MutationTuple<TData, TVariables, TContext, TCache> => {
  return apolloMutation(mutation, {
    awaitRefetchQueries: true,
    onError: error => toast.error(error.message),
    ...options,
  })
}

export default useMutation
