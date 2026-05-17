import { gql } from '@apollo/client';

export const COMPANY_CONTRACTS_WITH_REMAINING_CAPACITY = gql`
  query CompanyContractsWithRemainingCapacity {
    companyContractsWithRemainingCapacity {
      id
      name
      capacity
    }
  }
`;
