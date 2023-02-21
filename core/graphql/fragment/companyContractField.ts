import { gql } from '@apollo/client'

export const COMPANY_CONTRACT_FIELDS = gql`
  fragment companyContractFields on CompanyContract {
    id
    name
    price
    duration
    transferAt
    startedAt
    endedAt
    transferRate
    daysToPay
    contactName
    contactEmail
    contactPhone
    contractDoc
    industryDoc
    transferDoc
    description
  }
`
