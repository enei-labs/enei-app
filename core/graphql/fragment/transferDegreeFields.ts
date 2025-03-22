import { gql } from '@apollo/client'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment/powerPlants'

export const TRANSFER_DEGREE_FIELDS = gql`
  ${POWER_PLANT_FIELDS}
  fragment transferDegreeFields on TransferDegree {
    id
    degree
    user {
      id
      name
      contactEmail
    }
    powerPlant {
      ...powerPlantFields
    }
    createdAt
  }
`
