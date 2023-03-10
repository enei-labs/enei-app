import { gql } from '@apollo/client'
import { POWER_PLANTS_FIELDS } from '@core/graphql/fragment'

export const CREATE_POWER_PLANT = gql`
  ${POWER_PLANTS_FIELDS}
  mutation createPowerPlant($input: CreatePowerPlantInput!) {
    createPowerPlant(input: $input) {
      __typename
      ...powerPlantFields
    }
  }
`
