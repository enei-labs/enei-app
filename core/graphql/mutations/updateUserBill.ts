import { gql } from '@apollo/client'
import { USER_BILL_FIELDS} from '@core/graphql/fragment'

export const UPDATE_USER_BILL = gql`
  ${USER_BILL_FIELDS}
  mutation updateUserBill($input: UpdateUserBillInput!) {
    updateUserBill(input: $input) {
      __typename
      ...userBillFields
    }
  }
`
