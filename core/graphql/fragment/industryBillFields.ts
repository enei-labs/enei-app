import { gql } from '@apollo/client'

export const INDUSTRY_BILL_FIELDS = gql`
  fragment industryBillFields on IndustryBill {
    id
    name
    electricNumberInfos {
      number
      price
      degree
    }
    billingDate
    status
    transferDocumentNumbers
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