import { gql } from '@apollo/client'

export const INDUSTRY_BILL_CONFIG_FIELDS = gql`
  fragment industryBillConfigFields on IndustryBillConfig {
    id
    name
    industry {
      id
      name
      contactEmail
    }
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
`;