import { gql } from '@apollo/client'
import { USER_BILL_CONFIG_FIELDS } from '../fragment/userBillConfigFields'

export const USER_BILL_CONFIGS = gql`
  ${USER_BILL_CONFIG_FIELDS}
  query userBillConfigs(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    userBillConfigs(limit: $limit, offset: $offset, term: $term) {
      total
      list {
        ...userBillConfigFields
      }
    }
  }
`
