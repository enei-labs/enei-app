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
    officialTransferDate
    startedAt
    endedAt
    transferRate
    daysToPay
    contractDoc
    contractDocName
    industryDoc
    industryDocName
    transferDoc
    transferDocName
    description
  }
`
