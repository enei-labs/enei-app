import { gql } from '@apollo/client'
import { USER_BILL_CONFIG_FIELDS } from '@core/graphql/fragment/userBillConfigFields'

export const USER_BILL_CONFIG = gql`
  ${USER_BILL_CONFIG_FIELDS}
  query userBillConfig(
    $id: UUID!
  ) {
    userBillConfig(
      id: $id
    ) {
      ...userBillConfigFields
    }
  }
`
