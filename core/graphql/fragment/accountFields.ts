import { gql } from "@apollo/client";
import { ADMIN_FIELDS } from "@core/graphql/fragment/adminFields";

export const ACCOUNT_FIELDS = gql`
  fragment accountFields on Account {
    id
    role
    actions
    email
    name
    hasSetPassword
    companyName
  }
`;
