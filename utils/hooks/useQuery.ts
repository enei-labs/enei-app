import { useQuery as useApolloQuery, OperationVariables, DocumentNode, TypedDocumentNode, QueryHookOptions } from '@apollo/client'
import { toast } from 'react-toastify'

const useQuery = <TData = any, TVariables extends OperationVariables = OperationVariables>(
  query: DocumentNode | TypedDocumentNode<TData, TVariables>,
  options?: QueryHookOptions<TData, TVariables>
) => {
  const { loading, error, data, refetch } = useApolloQuery<TData, TVariables>(query, {
    ...options,
    onError: (err) => {
      toast.error(err.message)
      options?.onError?.(err) // Call any custom onError handler passed in options
    },
  })

  return { loading, error, data, refetch }
}

export default useQuery