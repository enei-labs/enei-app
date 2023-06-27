import { gql } from '@apollo/client'

export const FEE_FIELDS = gql`
  fragment feeFields on Fee {
    id
    substitutionFee
    certificateVerificationFee
    certificateServiceFee
    updatedAt
  }
`
