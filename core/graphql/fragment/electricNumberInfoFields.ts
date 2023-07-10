import { gql } from "@apollo/client";

export const ELECTRIC_NUMBER_INFO_FIELDS = gql`
  fragment electricNumberInfoFields on ElectricNumberInfo {
    number
    degree
    tableNumbers
    contactName
    contactPhone
    contactEmail
    address
  }
`