import { gql } from '@apollo/client'

export const UPDATE_FEE = gql`
  mutation updateFee($input: UpdateFeeInput!) {
    updateFee(input: $input) {
      __typename
    }
  }
`
