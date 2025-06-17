import { gql } from '@apollo/client'

export const USER_FIELDS = gql`
  fragment userFields on User {
    id
    name
    companyAddress
    notes
    contactName
    contactPhone
    contactEmail
    bankAccounts {
      bankCode
      bankName
      bankBranchCode
      bankBranchName
      accountName
      account
      taxId
    }
  }
`
