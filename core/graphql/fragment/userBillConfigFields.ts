import { gql } from "@apollo/client";

export const USER_BILL_CONFIG_FIELDS = gql`
  fragment userBillConfigFields on UserBillConfig {
    id
    name
    estimatedBillDeliverDate
    paymentDeadline
    recipientAccount {
      bankCode
      bankBranchCode
      account
    }
    electricNumberInfos {
      number
      price
    }
    transportationFee
    credentialInspectionFee
    credentialServiceFee
    noticeForTPCBill
    contactName
    contactPhone
    contactEmail
    address
  }
`