import { gql } from '@apollo/client'
import { TPC_BILL_FIELDS } from '@core/graphql/fragment'

export const CREATE_TPC_BILL = gql`
  ${TPC_BILL_FIELDS}
  mutation createTPCBill($input: CreateTPCBillInput!) {
    createTPCBill(input: $input) {
      __typename
      ...tpcBillFields
    }
  }
`
