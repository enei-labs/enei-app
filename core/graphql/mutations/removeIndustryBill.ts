import { gql } from '@apollo/client'

export const REMOVE_INDUSTRY_BILL = gql`
  mutation removeIndustryBill($id: UUID!) {
    removeIndustryBill(id: $id) {
      id
      __typename
    }
  }
`
