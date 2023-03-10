import { gql } from '@apollo/client'

export const POWER_PLANTS_FIELDS = gql`
  fragment powerPlantFields on PowerPlant {
    id
    name
    number
    capacity
    annualPowerGeneration
    predictAnnualPowerGeneration
    transferRate
    address
    createdBy
    createdAt
  }
`
