import type {
  DocumentNode,
  OperationVariables,
  QueryHookOptions,
  QueryResult,
  TypedDocumentNode,
} from '@apollo/client'
import { useQuery as apolloQuery } from '@apollo/client'
import { toast } from 'react-toastify'

const useQuery = <TData = any, TVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>,
): QueryResult<TData, TVariables> => {
  return apolloQuery(query, {
    notifyOnNetworkStatusChange: true,
    fetchPolicy: 'network-only',
    onError: error => toast.error(error.message),
    ...options,
  })
}

export default useQuery
