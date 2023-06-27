import { gql } from '@apollo/client'

export const UPDATE_FEE = gql`
  mutation updateFee($input: UpdateFee!) {
    updateFee(input: $input) {
      __typename
    }
  }
`
