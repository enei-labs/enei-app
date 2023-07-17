import { gql } from '@apollo/client'
import { USER_BILL_FIELDS} from '@core/graphql/fragment'

export const UPDATE_USER_BILL = gql`
  ${USER_BILL_FIELDS}
  mutation updateUserBillInput($input: UpdateUserBillInput!) {
    updateUserBillInput(input: $input) {
      __typename
      ...userBillFields
    }
  }
`
