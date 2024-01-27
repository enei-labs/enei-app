import { gql } from '@apollo/client'

export const COMPANY_CONTRACT_FIELDS = gql`
  fragment companyContractFields on CompanyContract {
    id
    contractTimeType
    name
    number
    rateType
    price
    duration
    transferAt
    startedAt
    endedAt
    transferRate
    daysToPay
    contractDoc
    industryDoc
    transferDoc
    description
  }
`
