import { UserContractPage } from '@core/graphql/types'
import useQuery from '../useQuery'
import { USER_CONTRACTS } from '@core/graphql/queries';

interface Variables {
  offset?: number;
  limit?: number;
  userId?: string;
}

export const useUserContracts = ({ skip = false, variables }: {
  skip?: boolean;
  variables?: Variables;
} = {} ) => {
  return useQuery<{ userContracts: UserContractPage }>(USER_CONTRACTS, {
    variables: variables,
    skip,
    notifyOnNetworkStatusChange: false,
    fetchPolicy: 'cache-first',
  })
}
