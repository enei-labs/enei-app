import { gql } from '@apollo/client'

export const USER_CONTRACT_FIELDS = gql`
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
    transferAt
    contractDoc
		electricNumberInfos {
			number
			tableNumbers
			address
		}
  }
`
