import { gql } from '@apollo/client'
import { COMPANY_FIELDS } from '../fragment'

export const COMPANIES = gql`
  ${COMPANY_FIELDS}
  query companies(
    $limit: Int = 10
    $offset: Int = 0
    $term: String
  ) {
    companies(
      limit: $limit
      offset: $offset
      term: $term
    ) {
      total
      list {
        ...companyFields
      }
    }
  }
`

export const COMPANIES_WITH_POWER_PLANTS = gql`
  query companiesWithPowerPlants {
    companies(limit: 1000, offset: 0) {
      total
      list {
        id
        name
        companyContracts {
          id
          name
          number
          powerPlants {
            id
            name
            number
            volume
          }
        }
      }
    }
  }
`
