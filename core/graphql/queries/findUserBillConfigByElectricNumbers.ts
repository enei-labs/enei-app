import { gql } from '@apollo/client'
import { USER_BILL_CONFIG_FIELDS } from '../fragment/userBillConfigFields'

export const FIND_USER_BILL_CONFIG_BY_ELECTRIC_NUMBERS = gql`
  ${USER_BILL_CONFIG_FIELDS}
  query findUserBillConfigByElectricNumbers($electricNumbers: [String!]!) {
    findUserBillConfigByElectricNumbers(electricNumbers: $electricNumbers) {
      ...userBillConfigFields
    }
  }
`
