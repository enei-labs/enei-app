import { gql } from '@apollo/client'

export const INDUSTRY_BILL_FIELDS = gql`
  fragment industryBillFields on IndustryBill {
    id
    name
    powerPlantNumber
    powerPlantName
    powerPlantAddress
    powerPlantVolume
    companyContractNumber
    transferDegree
    price
    supplyVolume
    transferDocumentNumber
    billingDate
    status
    billSource
    originalFileDownloadUrl
    generatedPdfDownloadUrl
    importedBy {
      id
      name
    }
    importedAt
    manualImportRecord {
      id
      fileName
      importedAt
      originalFileDownloadUrl
      generatedPdfDownloadUrl
    }
    industryBillConfig {
      id
      industry {
        id
        name
        contactName
        contactEmail
        contactPhone
        recipientAccounts {
          bankCode
          bankBranchCode
          accountName
          account
        }
      }
      name
      estimatedBillDeliverDate
      paymentDeadline
      recipientAccount {
        bankCode
        bankBranchCode
        account
      }
      noticeForTPCBill
      contactName
      contactPhone
      contactEmail
      address
    }
  }
`;

export const INDUSTRY_BILL_BASE_FIELDS = gql`
  fragment industryBillBaseFields on IndustryBill {
    id
    name
    powerPlantNumber
    powerPlantName
    powerPlantAddress
    powerPlantVolume
    companyContractNumber
    transferDegree
    price
    supplyVolume
    transferDocumentNumber
    billingDate
    status
    billSource
    originalFileDownloadUrl
    generatedPdfDownloadUrl
    importedAt
    manualImportRecord {
      id
      fileName
      importedAt
      generatedPdfDownloadUrl
    }
    industryBillConfig {
      id
      name
      estimatedBillDeliverDate
      paymentDeadline
      industry {
        id
        name
      }
      recipientAccount {
        bankCode
        bankBranchCode
        account
      }
      noticeForTPCBill
      contactName
      contactPhone
      contactEmail
      address
    }
  }
`

// 精簡版 fragment - 不包含 industryBillConfig.industry，給不需要發電業資訊的頁面使用
export const INDUSTRY_BILL_LIST_FIELDS = gql`
  fragment industryBillListFields on IndustryBill {
    id
    name
    powerPlantNumber
    powerPlantName
    status
    billSource
    originalFileDownloadUrl
    billingDate
  }
`