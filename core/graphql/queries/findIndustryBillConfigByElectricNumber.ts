import { gql } from '@apollo/client'
import { INDUSTRY_BILL_CONFIG_FIELDS } from '../fragment'

export const FIND_INDUSTRY_BILL_CONFIG_BY_ELECTRIC_NUMBER = gql`
  ${INDUSTRY_BILL_CONFIG_FIELDS}
  query findIndustryBillConfigByElectricNumber($electricNumber: String!) {
    findIndustryBillConfigByElectricNumber(electricNumber: $electricNumber) {
      ...industryBillConfigFields
    }
  }
`
