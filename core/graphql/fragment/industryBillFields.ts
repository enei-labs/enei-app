import { gql } from '@apollo/client'

export const INDUSTRY_BILL_FIELDS = gql`
  fragment industryBillFields on IndustryBill {
    id
    name
    powerPlantNumber
    powerPlantName
    powerPlantAddress
    companyContractNumber
    transferDegree
    price
    supplyVolume
    transferDocumentNumber
    billingDate
    status
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