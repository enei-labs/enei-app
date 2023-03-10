import { gql } from '@apollo/client'
import { POWER_PLANTS_FIELDS } from '@core/graphql/fragment'

export const POWER_PLANTS = gql`
  ${POWER_PLANTS_FIELDS}
  query powerPlants(
    $limit: Int = 10
    $offset: Int = 0
  ) {
    powerPlants(
      limit: $limit
      offset: $offset
    ) {
      total
      list {
        ...powerPlantFields
      }
    }
  }
`
