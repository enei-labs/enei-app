import { gql } from '@apollo/client';

export const FIND_INDUSTRY_BILL_BY_ELECTRIC_NUMBER_AND_MONTH = gql`
  query findIndustryBillByElectricNumberAndMonth(
    $electricNumber: String!
    $billingMonth: String!
    $industryBillConfigId: String!
  ) {
    findIndustryBillByElectricNumberAndMonth(
      electricNumber: $electricNumber
      billingMonth: $billingMonth
      industryBillConfigId: $industryBillConfigId
    ) {
      id
      powerPlantNumber
      powerPlantName
      billingDate
    }
  }
`;
