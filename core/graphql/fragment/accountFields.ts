import { gql } from "@apollo/client";

export const ACCOUNT_FIELDS = gql`
  fragment accountFields on Account {
    id
    role
    actions
    email
    name
    hasSetPassword
    companyName
    company {
      id
      name
    }
    recipientAccounts {
			bankCode
      bankName
      bankBranchCode
      bankBranchName
			accountName
      account
    }
  }
`;
