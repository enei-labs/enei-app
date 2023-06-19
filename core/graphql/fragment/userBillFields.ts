import { gql } from '@apollo/client'

export const USER_BILL_FIELDS = gql`
  fragment userBillFields on userBill {
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
      degree
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