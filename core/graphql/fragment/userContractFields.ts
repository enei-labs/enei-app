import { gql } from '@apollo/client'
import { ELECTRIC_NUMBER_INFO_FIELDS } from '@core/graphql/fragment/electricNumberInfoFields'

export const USER_CONTRACT_FIELDS = gql`
  ${ELECTRIC_NUMBER_INFO_FIELDS}
  fragment userContractFields on UserContract {
    id
    name
    userType
    serialNumber
    purchaseDegree
    price
    upperLimit
    lowerLimit
    salesPeriod
    contractTimeType
    salesAt
    salesTo
    transferAt
    contractDoc
		electricNumberInfos {
      ...electricNumberInfoFields
		}
  }
`
