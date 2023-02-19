import { gql } from "@apollo/client";
import { ACCOUNT_FIELDS } from "../fragment";

export const ACCOUNTS = gql`
  ${ACCOUNT_FIELDS}
  query accounts($limit: Int = 10, $offset: Int = 0) {
    accounts(limit: $limit, offset: $offset) {
      total
      list {
        ...accountFields
      }
    }
  }
`;
