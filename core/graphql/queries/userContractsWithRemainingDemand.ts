import { gql } from '@apollo/client';

export const USER_CONTRACTS_WITH_REMAINING_DEMAND = gql`
  query UserContractsWithRemainingDemand {
    userContractsWithRemainingDemand {
      id
      name
      capacity
      user {
        id
        name
      }
    }
  }
`;
