import { gql } from '@apollo/client'
import { ADMIN_FIELDS } from '../fragment'

export const ME = gql`
  ${ADMIN_FIELDS}
  query me {
    me {
      ...adminFields
    }
  }
`
