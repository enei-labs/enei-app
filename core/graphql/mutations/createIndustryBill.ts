import { gql } from "@apollo/client";
import { INDUSTRY_BILL_FIELDS } from "../fragment";

export const CREATE_INDUSTRY_BILL = gql`
  ${INDUSTRY_BILL_FIELDS}
  mutation createIndustryBill($input: CreateIndustryBillInput!) {
    createIndustryBill(input: $input) {
      __typename
      ...industryBillFields
    }
  }
`;
