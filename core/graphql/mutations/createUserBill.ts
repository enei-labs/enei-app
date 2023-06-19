import { gql } from "@apollo/client";
import { USER_BILL_FIELDS } from "../fragment";

export const CREATE_USER_BILL = gql`
  ${USER_BILL_FIELDS}
  mutation createUserBill($input: CreateUserBillInput!) {
    createUserBill(input: $input) {
      __typename
      ...userBillFields
    }
  }
`;
