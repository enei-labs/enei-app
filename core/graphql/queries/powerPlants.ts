import { gql } from '@apollo/client'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment'

export const POWER_PLANTS = gql`
  ${POWER_PLANT_FIELDS}
  query powerPlants(
    $limit: Int = 10
    $offset: Int = 0
    $companyContractId: UUID
  ) {
    powerPlants(
      limit: $limit
      offset: $offset
      companyContractId: $companyContractId
    ) {
      total
      list {
        ...powerPlantFields
      }
    }
  }
`
