import { gql } from '@apollo/client';

export const USER_STATS = gql`
  query UserStats {
    userStats {
      count
      yearlyGrowth
      totalRequireDegree
      averageSellingPrice
    }
  }
`;
