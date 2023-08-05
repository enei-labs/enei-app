import { gql } from '@apollo/client'
import { TRANSFER_DEGREE_FIELDS } from '@core/graphql/fragment/transferDegreeFields'

export const USER_FIELDS = gql`
  ${TRANSFER_DEGREE_FIELDS}
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
    }
    thisYearTransferRecords {
      ...transferDegreeFields
    }
    lastMonthTransferRecords {
      ...transferDegreeFields
    }
    estimatedTransferDegree
    expectedYearlyPurchaseDegree
  }
`
