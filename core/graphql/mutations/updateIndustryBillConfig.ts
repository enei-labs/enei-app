import { gql } from '@apollo/client'
import { INDUSTRY_BILL_CONFIG_FIELDS } from '@core/graphql/fragment'

export const UPDATE_INDUSTRY_BILL_CONFIG = gql`
  ${INDUSTRY_BILL_CONFIG_FIELDS}
  mutation updateIndustryBillConfig($input: UpdateIndustryBillConfigInput!) {
    updateIndustryBillConfig(input: $input) {
      __typename
      ...industryBillConfigFields
    }
  }
`
