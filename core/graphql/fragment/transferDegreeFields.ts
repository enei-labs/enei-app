import { gql } from '@apollo/client'
import { POWER_PLANT_FIELDS } from '@core/graphql/fragment/powerPlants'
import { USER_CONTRACT_FIELDS } from '@core/graphql/fragment/userContractFields'

export const TRANSFER_DEGREE_FIELDS = gql`
  ${USER_CONTRACT_FIELDS}
  ${POWER_PLANT_FIELDS}
  fragment transferDegreeFields on TransferDegree {
    id
    degree
    userContract {
      ...userContractFields
    }
    user {
      id
      name
      contactEmail
    }
    powerPlant {
      ...powerPlantFields
    }
  }
`
