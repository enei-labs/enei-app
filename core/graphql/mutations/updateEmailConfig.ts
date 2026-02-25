import { gql } from '@apollo/client'

export const UPDATE_EMAIL_CONFIG = gql`
  mutation updateEmailConfig($input: UpdateEmailConfigInput!) {
    updateEmailConfig(input: $input) {
      id
      isTestMode
      testRecipients
      updatedAt
    }
  }
`
