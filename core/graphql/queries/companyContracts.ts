import { gql } from '@apollo/client'
import { COMPANY_CONTRACT_FIELDS } from '../fragment/companyContractField'

export const COMPANY_CONTRACTS = gql`
  ${COMPANY_CONTRACT_FIELDS}
  query companyContracts(
    $limit: Int = 10
    $offset: Int = 0
    $companyId: ID!
  ) {
    companyContracts(
      limit: $limit
      offset: $offset
      companyId: $companyId
    ) {
      total
      list {
        ...companyContractFields
      }
    }
  }
`
