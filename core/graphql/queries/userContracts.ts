import { gql } from '@apollo/client'
import { USER_CONTRACT_FIELDS } from '@core/graphql/fragment'

export const USER_CONTRACTS = gql`
  ${USER_CONTRACT_FIELDS}
  query userContracts(
    $limit: Int = 10
    $offset: Int = 0
    $userId: UUID
    $term: String
  ) {
    userContracts(
      limit: $limit
      offset: $offset
      userId: $userId
      term: $term
    ) {
      total
      list {
        ...userContractFields
      }
    }
  }
`
