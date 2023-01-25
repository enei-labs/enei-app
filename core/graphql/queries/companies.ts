import { gql } from '@apollo/client'
import { COMPANY_FIELDS } from '../fragment'

export const COMPANIES = gql`
  ${COMPANY_FIELDS}
  query companies(
    $limit: Int = 10
    $offset: Int = 0
  ) {
    clients(
      limit: $limit
      offset: $offset
    ) {
      total
      list {
        ...companyFields
      }
    }
  }
`
