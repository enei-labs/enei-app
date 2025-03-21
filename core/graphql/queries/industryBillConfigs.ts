import { gql } from '@apollo/client'
import { INDUSTRY_BILL_CONFIG_FIELDS } from '../fragment'

export const INDUSTRY_BILL_CONFIGS = gql`
  ${INDUSTRY_BILL_CONFIG_FIELDS}
  query industryBillConfigs(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    industryBillConfigs(
      limit: $limit
      offset: $offset
      term: $term
    ) {
      total
      list {
        ...industryBillConfigFields
      }
    }
  }
`