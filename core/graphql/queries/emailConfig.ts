import { gql } from '@apollo/client'

export const EMAIL_CONFIG = gql`
  query emailConfig {
    emailConfig {
      id
      isTestMode
      testRecipients
      updatedAt
    }
  }
`
