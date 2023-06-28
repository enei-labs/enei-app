import { gql } from '@apollo/client'

export const USER_BILL_FIELDS = gql`
  fragment userBillFields on UserBill {
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
    noticeForTheBuilding
    noticeForTPCBill
    contactName
    contactPhone
    contactEmail
    address
  }
`;