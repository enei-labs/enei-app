
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
    "CreateAccountResponse": [
      "AccountAlreadyExistsError",
      "Admin",
      "Guest"
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
    "ModifyUserResponse": [
      "AccountAlreadyExistsError",
      "User"
    ],
    "RequestResetPasswordResponse": [
      "AccountNotFoundError",
      "InvalidSignInInputError",
      "PasswordReset"
    ],
    "ResetPasswordResponse": [
      "PasswordResetExpiredError",
      "Success"
    ],
    "SendResetPasswordEmailResponse": [
      "AccountNotFoundError",
      "Success"
    ],
    "SignInResponse": [
      "Admin",
      "Guest",
      "InvalidSignInInputError"
    ]
  }
};
      export default result;
    