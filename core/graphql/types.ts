export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: string;
  String: string;
  Boolean: boolean;
  Int: number;
  Float: number;
  DateTime: any;
};

export type Account = {
  actions: Array<Action>;
  createdAt: Scalars['DateTime'];
  creator?: Maybe<Admin>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  hasSetPassword: Scalars['Boolean'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  mobile: Scalars['String'];
  position?: Maybe<Scalars['String']>;
  removeRecord?: Maybe<RemoveAccountRecord>;
  role: Role;
};

export type AccountAlreadyExistsError = Error & {
  __typename?: 'AccountAlreadyExistsError';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type AccountNotFoundError = Error & {
  __typename?: 'AccountNotFoundError';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export enum Action {
  CreateAdmin = 'CREATE_ADMIN',
  RemoveAdmin = 'REMOVE_ADMIN',
  ViewAdminList = 'VIEW_ADMIN_LIST'
}

export type Admin = Account & {
  __typename?: 'Admin';
  actions: Array<Action>;
  createdAt: Scalars['DateTime'];
  creator?: Maybe<Admin>;
  email: Scalars['String'];
  firstName: Scalars['String'];
  hasSetPassword: Scalars['Boolean'];
  id: Scalars['ID'];
  lastName: Scalars['String'];
  mobile: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  position?: Maybe<Scalars['String']>;
  removeRecord?: Maybe<RemoveAccountRecord>;
  role: Role;
};

export type AdminPage = {
  __typename?: 'AdminPage';
  list: Array<Admin>;
  total: Scalars['Int'];
};

export enum AdminRole {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN'
}

export type ChangePasswordResponse = Admin | InvalidCurrentPasswordError;

export type CreateAdminInput = {
  email: Scalars['String'];
  firstName: Scalars['String'];
  lastName: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  position: Scalars['String'];
  role: AdminRole;
};

export type CreateAdminResponse = AccountAlreadyExistsError | Admin;

export type Error = {
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type InvalidCurrentPasswordError = Error & {
  __typename?: 'InvalidCurrentPasswordError';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type InvalidSignInInputError = Error & {
  __typename?: 'InvalidSignInInputError';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: ChangePasswordResponse;
  createAdmin: CreateAdminResponse;
  removeAdmin: Admin;
  resetPassword: ResetPasswordResponse;
  sendResetPasswordEmail: SendResetPasswordEmailResponse;
  setPassword: Account;
  signInAdmin: SignInAdminResponse;
  signOut: Success;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationCreateAdminArgs = {
  input: CreateAdminInput;
};


export type MutationRemoveAdminArgs = {
  input: RemoveAdminInput;
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['String'];
};


export type MutationSendResetPasswordEmailArgs = {
  email: Scalars['String'];
};


export type MutationSetPasswordArgs = {
  newPassword: Scalars['String'];
};


export type MutationSignInAdminArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};

export type PasswordResetExpiredError = Error & {
  __typename?: 'PasswordResetExpiredError';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type Query = {
  __typename?: 'Query';
  adminPermissions: Array<RoleInfo>;
  admins: AdminPage;
  me?: Maybe<Account>;
};


export type QueryAdminsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  role?: InputMaybe<AdminRole>;
};

export type RemoveAccountRecord = {
  __typename?: 'RemoveAccountRecord';
  account: Account;
  createdAt: Scalars['DateTime'];
  creator: Account;
  reason: Scalars['String'];
};

export type RemoveAdminInput = {
  adminId: Scalars['ID'];
  reason: Scalars['String'];
};

export type ResetPasswordResponse = PasswordResetExpiredError | Success;

export enum Role {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN',
  User = 'USER'
}

export type RoleInfo = {
  __typename?: 'RoleInfo';
  actions: Array<Action>;
  admins: Array<Admin>;
  role: Role;
};

export type SendResetPasswordEmailResponse = AccountNotFoundError | Success;

export type SignInAdminResponse = Admin | InvalidSignInInputError;

export type Success = {
  __typename?: 'Success';
  id: Scalars['ID'];
  message: Scalars['String'];
};
