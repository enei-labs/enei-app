import { gql } from '@apollo/client'
import { USER_CONTRACT_FIELDS} from '@core/graphql/fragment'

export const UPDATE_USER_CONTRACT = gql`
  ${USER_CONTRACT_FIELDS}
  mutation updateUserContract($input: UpdateUserContractInput!) {
    updateUserContract(input: $input) {
      __typename
      ...userContractFields
    }
  }
`
