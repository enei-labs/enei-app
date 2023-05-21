import { gql } from '@apollo/client'

export const COMPANY_FIELDS = gql`
  fragment companyFields on Company {
    id
    name
    taxId
    contactName
    contactEmail
    contactPhone
    totalVolume
    recipientAccounts
  }
`
