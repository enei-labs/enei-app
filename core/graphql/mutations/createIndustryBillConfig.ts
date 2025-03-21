import { gql } from "@apollo/client";
import { INDUSTRY_BILL_CONFIG_FIELDS } from "../fragment";

export const CREATE_INDUSTRY_BILL_CONFIG = gql`
  ${INDUSTRY_BILL_CONFIG_FIELDS}
  mutation createIndustryBillConfig($input: CreateIndustryBillConfigInput!) {
    createIndustryBillConfig(input: $input) {
      __typename
      ...industryBillConfigFields
    }
  }
`;
