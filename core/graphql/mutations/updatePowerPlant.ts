import { gql } from '@apollo/client'
import { POWER_PLANTS_FIELDS } from '@core/graphql/fragment'

export const UPDATE_POWER_PLANT = gql`
  ${POWER_PLANTS_FIELDS}
  mutation updatePowerPlant($input: UpdatePowerPlantInput!) {
    updatePowerPlant(input: $input) {
      __typename
      ...powerPlantFields
    }
  }
`
