import { gql } from '@apollo/client'

export const POWER_PLANT_FIELDS = gql`
  fragment powerPlantFields on PowerPlant {
    id
    name
    number
    volume
    transferRate
    supplyVolume
    estimatedAnnualPowerGeneration
    estimatedAnnualPowerSupply
    address
    createdBy
    createdAt
  }
`
