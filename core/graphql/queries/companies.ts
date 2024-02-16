import { gql } from '@apollo/client'
import { COMPANY_FIELDS, POWER_PLANT_FIELDS } from '../fragment'

export const COMPANIES = gql`
  ${COMPANY_FIELDS}
  query companies(
    $limit: Int = 10
    $offset: Int = 0
  ) {
    companies(
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

export const COMPANIES_WITH_POWER_PLANTS = gql`
  ${POWER_PLANT_FIELDS}
  query companiesWithPowerPlants {
    companies {
      total
      list {
        id
        name
        companyContracts {
          id
          name
          number
          powerPlants {
            ...powerPlantFields
          }
        }
      }
    }
  }
`
