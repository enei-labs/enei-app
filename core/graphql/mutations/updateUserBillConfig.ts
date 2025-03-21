import { gql } from '@apollo/client'
import { USER_BILL_CONFIG_FIELDS } from '@core/graphql/fragment/userBillConfigFields'

export const UPDATE_USER_BILL_CONFIG = gql`
  ${USER_BILL_CONFIG_FIELDS}
  mutation updateUserBillConfig($input: UpdateUserBillConfigInput!) {
    updateUserBillConfig(input: $input) {
      __typename
      ...userBillConfigFields
    }
  }
`
