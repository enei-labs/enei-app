import { gql } from '@apollo/client'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment'

export const CREATE_POWER_PLANT = gql`
  ${POWER_PLANT_FIELDS}
  mutation createPowerPlant($input: CreatePowerPlantInput!) {
    createPowerPlant(input: $input) {
      __typename
      ...powerPlantFields
    }
  }
`
