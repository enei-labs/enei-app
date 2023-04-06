import { User } from '@core/graphql/types'
import useQuery from '../useQuery'
import { USER } from '@core/graphql/queries';

export const useUser = (id: string) => {
  return useQuery<{ user: User }>(USER, {
    variables: { id: id },
    skip: !id,
  })
}
