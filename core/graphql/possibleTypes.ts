
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Account": [
      "Admin"
    ],
    "ChangePasswordResponse": [
      "Admin",
      "InvalidCurrentPasswordError"
    ],
    "CreateAdminResponse": [
      "AccountAlreadyExistsError",
      "Admin"
    ],
    "Error": [
      "AccountAlreadyExistsError",
      "AccountNotFoundError",
      "InvalidCurrentPasswordError",
      "InvalidSignInInputError",
      "PasswordResetExpiredError"
    ],
    "ResetPasswordResponse": [
      "PasswordResetExpiredError",
      "Success"
    ],
    "SendResetPasswordEmailResponse": [
      "AccountNotFoundError",
      "Success"
    ],
    "SignInAdminResponse": [
      "Admin",
      "InvalidSignInInputError"
    ]
  }
};
      export default result;
    