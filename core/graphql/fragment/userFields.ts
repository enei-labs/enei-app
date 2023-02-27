import { gql } from '@apollo/client'

export const USER_FIELDS = gql`
  fragment UserFields on User {
    id
    name
    companyAddress
    notes
    contactName
    contactPhone
    contactEmail
  }
`
