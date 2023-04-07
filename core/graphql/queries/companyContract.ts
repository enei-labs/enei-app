import { gql } from '@apollo/client'
import { COMPANY_FIELDS } from '@core/graphql/fragment'
import { COMPANY_CONTRACT_FIELDS } from '../fragment/companyContractFields'

export const COMPANY_CONTRACT = gql`
  ${COMPANY_CONTRACT_FIELDS}
  ${COMPANY_FIELDS}
  query companyContract(
    $id: UUID!
  ) {
    companyContract(
      id: $id
    ) {
      ...companyContractFields
      company {
        ...companyFields
      }
    }
  }
`
