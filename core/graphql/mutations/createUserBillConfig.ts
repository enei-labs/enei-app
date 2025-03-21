import { gql } from "@apollo/client";
import { USER_BILL_CONFIG_FIELDS } from "../fragment/userBillConfigFields";

export const CREATE_USER_BILL_CONFIG = gql`
  ${USER_BILL_CONFIG_FIELDS}
  mutation createUserBillConfig($input: CreateUserBillConfigInput!) {
    createUserBillConfig(input: $input) {
      __typename
      ...userBillConfigFields
    }
  }
`;
