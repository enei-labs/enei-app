import { gql } from "@apollo/client";
export const USER_BILL_CONFIG_FIELDS = gql`
  fragment userBillConfigFields on UserBillConfig {
    id
    user {
      id
      name
      contactEmail
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
`