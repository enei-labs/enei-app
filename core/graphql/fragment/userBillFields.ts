import { gql } from '@apollo/client'
import { USER_FIELDS } from '@core/graphql/fragment/userFields';

export const USER_BILL_FIELDS = gql`
  ${USER_FIELDS}
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
    noticeForTPCBill
    contactName
    contactPhone
    contactEmail
    address
    user {
      ...userFields
    }
  }
`;