import { gql } from '@apollo/client'
import { ACCOUNT_FIELDS } from '../fragment'

export const ME = gql`
  ${ACCOUNT_FIELDS}
  query me {
    me {
      ...accountFields
      __typename
    }
  }
`
