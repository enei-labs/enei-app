import { gql } from '@apollo/client'

export const COMPANY_FIELDS = gql`
  fragment companyFields on Company {
    id
    name
    taxId
    type
    contactName
    contactEmails
    contactPhone
    totalVolume
    recipientAccounts {
      bankCode
      bankBranchCode
      accountName
      account
    }
  }
`
