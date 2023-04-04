import { gql } from '@apollo/client'
import { COMPANY_CONTRACT_FIELDS } from '../fragment/companyContractFields'

export const COMPANY_CONTRACT = gql`
  ${COMPANY_CONTRACT_FIELDS}
  query companyContract(
    $id: UUID!
  ) {
    companyContract(
      id: $id
    ) {
      ...companyContractFields
    }
  }
`
