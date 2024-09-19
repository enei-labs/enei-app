import { gql } from '@apollo/client'
import { INDUSTRY_BILL_FIELDS } from '@core/graphql/fragment'

export const UPDATE_INDUSTRY_BILL = gql`
  ${INDUSTRY_BILL_FIELDS}
  mutation updateIndustryBill($input: UpdateIndustryBillInput!) {
    updateIndustryBill(input: $input) {
      __typename
      ...industryBillFields
    }
  }
`
