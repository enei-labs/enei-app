
      export interface PossibleTypesResultData {
        possibleTypes: {
          [key: string]: string[]
        }
      }
      const result: PossibleTypesResultData = {
  "possibleTypes": {
    "Account": [
      "Admin",
      "Guest"
    ],
    "ChangePasswordResponse": [
      "Admin",
      "InvalidCurrentPasswordError"
    ],
    "CreateAdminResponse": [
      "AccountAlreadyExistsError",
      "Admin"
    ],
    "CreateUserResponse": [
      "AccountAlreadyExistsError",
      "User"
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
    ],
    "SignInUserResponse": [
      "InvalidSignInInputError",
      "User"
    ]
  }
};
      export default result;
    