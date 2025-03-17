import { gql } from '@apollo/client'
import { COMPANY_FIELDS } from '@core/graphql/fragment/companyFields';

export const INDUSTRY_BILL_FIELDS = gql`
  ${COMPANY_FIELDS}
  fragment industryBillFields on IndustryBill {
    id
    name
    industry {
      ...companyFields
    }
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
`;