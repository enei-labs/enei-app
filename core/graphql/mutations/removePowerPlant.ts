import { gql } from '@apollo/client'

export const REMOVE_POWER_PLANT = gql`
  mutation removePowerPlant($id: UUID!) {
    removePowerPlant(id: $id) {
      id
      __typename
    }
  }
`
