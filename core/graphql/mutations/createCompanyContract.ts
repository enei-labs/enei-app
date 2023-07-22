import { gql } from '@apollo/client'
import { COMPANY_CONTRACT_FIELDS } from '@core/graphql/fragment'

export const CREATE_COMPANY_CONTRACT = gql`
  ${COMPANY_CONTRACT_FIELDS}
  mutation createCompanyContract($input: CreateCompanyContractInput!) {
    createCompanyContract(input: $input) {
      __typename
      ...companyContractFields
    }
  }
`
