import { gql } from '@apollo/client'
import { FEE_FIELDS } from '../fragment'

export const FEE = gql`
  ${FEE_FIELDS}
  query fee {
    fee {
      ...feeFields
    }
  }
`
