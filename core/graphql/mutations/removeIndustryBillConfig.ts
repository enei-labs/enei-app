import { gql } from '@apollo/client'

export const REMOVE_INDUSTRY_BILL_CONFIG = gql`
  mutation removeIndustryBillConfig($id: UUID!) {
    removeIndustryBillConfig(id: $id) {
      id
      __typename
    }
  }
`
