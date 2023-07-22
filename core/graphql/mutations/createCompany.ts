import { gql } from '@apollo/client'
import { COMPANY_FIELDS } from '@core/graphql/fragment'

export const CREATE_COMPANY = gql`
  ${COMPANY_FIELDS}
  mutation createCompany($input: CreateCompanyInput!) {
    createCompany(input: $input) {
      __typename
      ...companyFields
    }
  }
`
