import { gql } from '@apollo/client'
import { COMPANY_CONTRACT_FIELDS } from '../fragment/companyContractField'

export const COMPANY_CONTRACT = gql`
  ${COMPANY_CONTRACT_FIELDS}
  query companyContract(
    $id: ID
  ) {
    companyContract(
      id: $id
    ) {
      ...companyContractFields
    }
  }
`
