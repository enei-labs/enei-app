import { gql } from '@apollo/client';

export const COMPANY_STATS = gql`
  query CompanyStats {
    companyStats {
      totalCompanies
      totalPowerPlants
      totalVolume
      averagePurchasePrice
    }
  }
`;
