import { gql } from '@apollo/client';

export const EXPIRING_USER_CONTRACTS = gql`
  query ExpiringUserContracts($limit: Int) {
    expiringUserContracts(limit: $limit) {
      id
      name
      serialNumber
      salesAt
      salesTo
      user {
        id
        name
      }
    }
  }
`;
