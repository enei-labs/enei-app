import { gql } from '@apollo/client'

export const USER_BILL_FIELDS = gql`
  fragment userBillFields on UserBill {
    id
    name
    electricNumberInfos {
      number
      price
      degree
      fee
    }
    billingDate
    status
    transferDocumentNumbers
    billSource
    originalFileDownloadUrl
    generatedPdfDownloadUrl
    importedBy {
      id
      name
    }
    importedAt
    userBillConfig {
      id
      user {
        id
        name
        contactName
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
        companyAddress
      }
      name
      estimatedBillDeliverDate
      paymentDeadline
      recipientAccount {
        bankCode
        bankBranchCode
        account
      }
      electricNumbers
      transportationFee
      credentialInspectionFee
      credentialServiceFee
      noticeForTPCBill
      contactName
      contactPhone
      contactEmail
      address
    }
  }
`;

export const USER_BILL_BASE_FIELDS = gql`
  fragment userBillBaseFields on UserBill {
    id
    name
    electricNumberInfos {
      number
      price
      degree
      fee
    }
    billingDate
    status
    transferDocumentNumbers
    billSource
    originalFileDownloadUrl
    generatedPdfDownloadUrl
    importedAt
    userBillConfig {
      id
      user {
        id
        name
        contactName
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
        companyAddress
      }
      name
      estimatedBillDeliverDate
      paymentDeadline
      recipientAccount {
        bankCode
        bankBranchCode
        account
      }
      electricNumbers
      transportationFee
      credentialInspectionFee
      credentialServiceFee
      noticeForTPCBill
      contactName
      contactPhone
      contactEmail
      address
    }
  }
`