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
  UUID: any;
};

export type Account = {
  actions: Array<Action>;
  companyName?: Maybe<Scalars['String']>;
  createdAt: Scalars['DateTime'];
  creator?: Maybe<Admin>;
  email: Scalars['String'];
  hasSetPassword: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  recipientAccounts?: Maybe<Array<RecipientAccount>>;
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

export type AccountPage = {
  __typename?: 'AccountPage';
  list: Array<Account>;
  total: Scalars['Int'];
};

export enum Action {
  CreateAccount = 'CREATE_ACCOUNT',
  CreateAdmin = 'CREATE_ADMIN',
  CreateCompany = 'CREATE_COMPANY',
  CreateCompanyContract = 'CREATE_COMPANY_CONTRACT',
  CreateFee = 'CREATE_FEE',
  CreateGuest = 'CREATE_GUEST',
  CreatePowerPlant = 'CREATE_POWER_PLANT',
  CreateTpcBill = 'CREATE_TPC_BILL',
  CreateTransferDocument = 'CREATE_TRANSFER_DOCUMENT',
  CreateUser = 'CREATE_USER',
  CreateUserBill = 'CREATE_USER_BILL',
  CreateUserContract = 'CREATE_USER_CONTRACT',
  RemoveAccount = 'REMOVE_ACCOUNT',
  RemoveAdmin = 'REMOVE_ADMIN',
  RemoveCompany = 'REMOVE_COMPANY',
  RemoveCompanyContract = 'REMOVE_COMPANY_CONTRACT',
  RemoveGuest = 'REMOVE_GUEST',
  RemovePowerPlant = 'REMOVE_POWER_PLANT',
  RemoveTpcBill = 'REMOVE_TPC_BILL',
  RemoveTransferDocument = 'REMOVE_TRANSFER_DOCUMENT',
  RemoveUser = 'REMOVE_USER',
  RemoveUserBill = 'REMOVE_USER_BILL',
  RemoveUserContract = 'REMOVE_USER_CONTRACT',
  SendResetPasswordEmail = 'SEND_RESET_PASSWORD_EMAIL',
  UpdateAccount = 'UPDATE_ACCOUNT',
  UpdateCompany = 'UPDATE_COMPANY',
  UpdateCompanyContract = 'UPDATE_COMPANY_CONTRACT',
  UpdateFee = 'UPDATE_FEE',
  UpdatePowerPlant = 'UPDATE_POWER_PLANT',
  UpdateTpcBill = 'UPDATE_TPC_BILL',
  UpdateTransferDocument = 'UPDATE_TRANSFER_DOCUMENT',
  UpdateUser = 'UPDATE_USER',
  UpdateUserBill = 'UPDATE_USER_BILL',
  UpdateUserContract = 'UPDATE_USER_CONTRACT',
  ViewAccountList = 'VIEW_ACCOUNT_LIST',
  ViewAdminList = 'VIEW_ADMIN_LIST',
  ViewCompanyContractList = 'VIEW_COMPANY_CONTRACT_LIST',
  ViewCompanyList = 'VIEW_COMPANY_LIST',
  ViewGuestList = 'VIEW_GUEST_LIST',
  ViewPowerPlantList = 'VIEW_POWER_PLANT_LIST',
  ViewTpcBillList = 'VIEW_TPC_BILL_LIST',
  ViewTransferDocumentList = 'VIEW_TRANSFER_DOCUMENT_LIST',
  ViewUserBillList = 'VIEW_USER_BILL_LIST',
  ViewUserContractList = 'VIEW_USER_CONTRACT_LIST',
  ViewUserList = 'VIEW_USER_LIST'
}

export type Admin = Account & {
  __typename?: 'Admin';
  actions: Array<Action>;
  companyName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator?: Maybe<Admin>;
  email: Scalars['String'];
  hasSetPassword: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  recipientAccounts?: Maybe<Array<RecipientAccount>>;
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

export type BankAccount = {
  __typename?: 'BankAccount';
  account: Scalars['String'];
  code: Scalars['String'];
};

export type BankAccountInput = {
  account: Scalars['String'];
  code: Scalars['String'];
};

export type ChangePasswordResponse = Admin | InvalidCurrentPasswordError;

export enum ChargeType {
  Self = 'SELF',
  User = 'USER'
}

export type Company = {
  __typename?: 'Company';
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  recipientAccounts: Array<RecipientAccount>;
  taxId: Scalars['String'];
  /** 裝置量=該發電業簽署的合約裡面，所有裝置量的加總 */
  totalVolume: Scalars['Int'];
};

export type CompanyContract = {
  __typename?: 'CompanyContract';
  company: Company;
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  contractDoc: Scalars['String'];
  contractTimeType: ContractTimeType;
  /** 轉供條件 */
  daysToPay: Scalars['Int'];
  description?: Maybe<Scalars['String']>;
  /** 合約年限 */
  duration: Scalars['String'];
  endedAt: Scalars['DateTime'];
  id: Scalars['ID'];
  industryDoc: Scalars['String'];
  name: Scalars['String'];
  /** 合約編號 */
  number: Scalars['String'];
  /** 合約價格 */
  price: Scalars['String'];
  startedAt: Scalars['DateTime'];
  transferAt?: Maybe<Scalars['DateTime']>;
  transferDoc: Scalars['String'];
  /** 轉供率要求（%） */
  transferRate: Scalars['Int'];
};

export type CompanyContractPage = {
  __typename?: 'CompanyContractPage';
  list: Array<CompanyContract>;
  total: Scalars['Int'];
};

export type CompanyPage = {
  __typename?: 'CompanyPage';
  list: Array<Company>;
  total: Scalars['Int'];
};

export enum ContractTimeType {
  ContractEndTime = 'CONTRACT_END_TIME',
  ContractStartTime = 'CONTRACT_START_TIME',
  TransferStartTime = 'TRANSFER_START_TIME'
}

export type CreateAccountInput = {
  companyId?: InputMaybe<Scalars['String']>;
  email: Scalars['String'];
  name: Scalars['String'];
  role: Role;
  userId?: InputMaybe<Scalars['String']>;
};

export type CreateAccountResponse = AccountAlreadyExistsError | Admin | Guest;

export type CreateAdminInput = {
  email: Scalars['String'];
  name: Scalars['String'];
  role: AdminRole;
};

export type CreateAdminResponse = AccountAlreadyExistsError | Admin;

export type CreateCompanyContractInput = {
  companyId: Scalars['ID'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  contractDoc: Scalars['String'];
  contractTimeType: ContractTimeType;
  daysToPay: Scalars['Int'];
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  endedAt?: InputMaybe<Scalars['DateTime']>;
  industryDoc: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  price: Scalars['String'];
  startedAt: Scalars['DateTime'];
  transferDoc: Scalars['String'];
  transferRate: Scalars['Int'];
};

export type CreateCompanyInput = {
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  name: Scalars['String'];
  taxId: Scalars['String'];
};

export type CreatePowerPlantInput = {
  address: Scalars['String'];
  companyContractId: Scalars['ID'];
  estimatedAnnualPowerGeneration: Scalars['Int'];
  name: Scalars['String'];
  number: Scalars['String'];
  transferRate: Scalars['Int'];
  volume: Scalars['Int'];
};

export type CreateTpcBillInput = {
  billDoc: Scalars['String'];
  billReceivedDate: Scalars['DateTime'];
  transferDegrees: Array<CreateTransferDegreeInput>;
  transferDocumentId: Scalars['ID'];
};

export type CreateTransferDegreeInput = {
  degree: Scalars['Int'];
  powerPlantId: Scalars['ID'];
  userContractId: Scalars['ID'];
  userId: Scalars['ID'];
};

export type CreateTransferDocumentInput = {
  expectedTime: Scalars['DateTime'];
  formalDoc: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  powerPlants: Array<CreateTransferDocumentPowerPlantInput>;
  printingDoc: Scalars['String'];
  receptionAreas: Scalars['String'];
  replyDoc: Scalars['String'];
  users: Array<CreateTransferDocumentUserInput>;
  wordDoc: Scalars['String'];
};

export type CreateTransferDocumentPowerPlantInput = {
  estimateAnnualSupply: Scalars['Int'];
  powerPlantId: Scalars['ID'];
  transferRate: Scalars['Int'];
};

export type CreateTransferDocumentUserInput = {
  electricNumber: Scalars['String'];
  /** 要小於電號的電號年預計採購度數 */
  expectedYearlyPurchaseDegree: Scalars['Int'];
  monthlyTransferDegree: Scalars['Int'];
  userContractId: Scalars['ID'];
  userId: Scalars['ID'];
  yearlyTransferDegree: Scalars['Int'];
};

export type CreateUserBillInput = {
  address: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  credentialInspectionFee: ChargeType;
  credentialServiceFee: ChargeType;
  electricNumbers: Array<Scalars['String']>;
  /** 預計電費單寄出期限（收到繳費通知單後天數 */
  estimatedBillDeliverDate: Scalars['Float'];
  name: Scalars['String'];
  noticeForTPCBill: Scalars['Boolean'];
  noticeForTheBuilding: Scalars['Boolean'];
  /** 用戶繳費期限（收到繳費通知單後天數） */
  paymentDeadline: Scalars['Float'];
  recipientAccount: UserBillRecipientAccountInput;
  transportationFee: ChargeType;
  userId: Scalars['String'];
};

export type CreateUserContractInput = {
  contractDoc: Scalars['String'];
  electricNumberInfos: Array<ElectricNumberInfoInput>;
  lowerLimit: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['Int'];
  purchaseDegree: Scalars['Int'];
  salesPeriod: Scalars['String'];
  serialNumber: Scalars['String'];
  transferAt?: InputMaybe<Scalars['DateTime']>;
  upperLimit: Scalars['Int'];
  userType: UserType;
};

export type CreateUserInput = {
  bankAccounts: Array<BankAccountInput>;
  companyAddress: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  warning?: InputMaybe<Scalars['String']>;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  companyInfo: DashboardCompany;
  userInfo: DashboardUser;
};

export type DashboardCompany = {
  __typename?: 'DashboardCompany';
  count: Scalars['Int'];
  /** 總裝置量 */
  totalDegree: Scalars['Int'];
  totalVolume: Scalars['Int'];
};

export type DashboardUser = {
  __typename?: 'DashboardUser';
  count: Scalars['Int'];
  /** 售出總度數 */
  totalSalesDegree: Scalars['Int'];
  /** 年度用戶成長數 */
  yearlyGrowth: Scalars['Int'];
};

export type ElectricNumberInfo = {
  __typename?: 'ElectricNumberInfo';
  address: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  degree: Scalars['Int'];
  number: Scalars['String'];
  tableNumbers: Array<Scalars['String']>;
};

export type ElectricNumberInfoInput = {
  address: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  degree: Scalars['Int'];
  number: Scalars['String'];
  tableNumbers: Array<Scalars['String']>;
};

export type Error = {
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type Fee = {
  __typename?: 'Fee';
  /** 憑證服務費 */
  certificateServiceFee: Scalars['String'];
  /** 憑證查驗費 */
  certificateVerificationFee: Scalars['String'];
  id: Scalars['ID'];
  /** 代輸費 */
  substitutionFee: Scalars['String'];
  updatedAt: Scalars['DateTime'];
};

export type Guest = Account & {
  __typename?: 'Guest';
  actions: Array<Action>;
  company: Company;
  companyName: Scalars['String'];
  createdAt: Scalars['DateTime'];
  creator?: Maybe<Admin>;
  email: Scalars['String'];
  hasSetPassword: Scalars['Boolean'];
  id: Scalars['ID'];
  name: Scalars['String'];
  recipientAccounts?: Maybe<Array<RecipientAccount>>;
  removeRecord?: Maybe<RemoveAccountRecord>;
  role: Role;
};

export type GuestPage = {
  __typename?: 'GuestPage';
  list: Array<Guest>;
  total: Scalars['Int'];
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

export type ModifyUserInput = {
  bankAccounts: Array<BankAccountInput>;
  companyAddress: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  name: Scalars['String'];
  notes?: InputMaybe<Scalars['String']>;
  warning?: InputMaybe<Scalars['String']>;
};

export type ModifyUserResponse = AccountAlreadyExistsError | User;

export type Mutation = {
  __typename?: 'Mutation';
  changePassword: ChangePasswordResponse;
  createAccount: CreateAccountResponse;
  createAdmin: CreateAdminResponse;
  createCompany: Company;
  createCompanyContract: CompanyContract;
  createPowerPlant: PowerPlant;
  createTPCBill: TpcBill;
  createTransferDocument: TransferDocument;
  createUser: User;
  createUserBill: UserBill;
  createUserContract: UserContract;
  modifyAccount: Account;
  modifyProfile: Account;
  modifyUser: ModifyUserResponse;
  removeAccount: Account;
  removeAdmin: Admin;
  removeCompanyContract: CompanyContract;
  removeGuest: Guest;
  removePowerPlant: PowerPlant;
  removeTransferDocument: TransferDocument;
  removeUser: User;
  requestResetPassword: RequestResetPasswordResponse;
  resetPassword: ResetPasswordResponse;
  sendResetPasswordEmail: SendResetPasswordEmailResponse;
  setPassword: Account;
  signIn: SignInResponse;
  signOut: Success;
  updateCompany: Company;
  updateCompanyContract: CompanyContract;
  updateFee: Fee;
  updatePowerPlant: PowerPlant;
  updateTransferDocument: TransferDocument;
  updateTransferDocumentStage: TransferDocument;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String'];
  newPassword: Scalars['String'];
};


export type MutationCreateAccountArgs = {
  input: CreateAccountInput;
};


export type MutationCreateAdminArgs = {
  input: CreateAdminInput;
};


export type MutationCreateCompanyArgs = {
  input: CreateCompanyInput;
};


export type MutationCreateCompanyContractArgs = {
  input: CreateCompanyContractInput;
};


export type MutationCreatePowerPlantArgs = {
  input: CreatePowerPlantInput;
};


export type MutationCreateTpcBillArgs = {
  input: CreateTpcBillInput;
};


export type MutationCreateTransferDocumentArgs = {
  input: CreateTransferDocumentInput;
};


export type MutationCreateUserArgs = {
  input: CreateUserInput;
};


export type MutationCreateUserBillArgs = {
  input: CreateUserBillInput;
};


export type MutationCreateUserContractArgs = {
  input: CreateUserContractInput;
  userId: Scalars['String'];
};


export type MutationModifyAccountArgs = {
  companyId?: InputMaybe<Scalars['ID']>;
  email?: InputMaybe<Scalars['String']>;
  id: Scalars['ID'];
  name?: InputMaybe<Scalars['String']>;
  recipientAccounts?: InputMaybe<Array<UpdateRecipientAccountInput>>;
};


export type MutationModifyProfileArgs = {
  email?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  recipientAccounts?: InputMaybe<Array<UpdateRecipientAccountInput>>;
};


export type MutationModifyUserArgs = {
  id: Scalars['UUID'];
  input: ModifyUserInput;
};


export type MutationRemoveAccountArgs = {
  input: RemoveAccountInput;
};


export type MutationRemoveAdminArgs = {
  input: RemoveAdminInput;
};


export type MutationRemoveCompanyContractArgs = {
  id: Scalars['UUID'];
};


export type MutationRemoveGuestArgs = {
  input: RemoveGuestInput;
};


export type MutationRemovePowerPlantArgs = {
  id: Scalars['UUID'];
};


export type MutationRemoveTransferDocumentArgs = {
  id: Scalars['UUID'];
};


export type MutationRemoveUserArgs = {
  input: RemoveUserInput;
};


export type MutationRequestResetPasswordArgs = {
  id: Scalars['ID'];
  oldPassword: Scalars['String'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String'];
  token: Scalars['ID'];
};


export type MutationSendResetPasswordEmailArgs = {
  id: Scalars['ID'];
};


export type MutationSetPasswordArgs = {
  newPassword: Scalars['String'];
};


export type MutationSignInArgs = {
  email: Scalars['String'];
  password: Scalars['String'];
};


export type MutationUpdateCompanyArgs = {
  input: UpdateCompanyInput;
};


export type MutationUpdateCompanyContractArgs = {
  input: UpdateCompanyContractInput;
};


export type MutationUpdateFeeArgs = {
  input: UpdateFeeInput;
};


export type MutationUpdatePowerPlantArgs = {
  input: UpdatePowerPlantInput;
};


export type MutationUpdateTransferDocumentArgs = {
  id: Scalars['UUID'];
  input: UpdateTransferDocumentInput;
};


export type MutationUpdateTransferDocumentStageArgs = {
  id: Scalars['UUID'];
  input?: InputMaybe<UpdateTransferDocumentStageInput>;
  moveNextStep: Scalars['Boolean'];
};

export type PasswordReset = {
  __typename?: 'PasswordReset';
  id: Scalars['ID'];
};

export type PasswordResetExpiredError = Error & {
  __typename?: 'PasswordResetExpiredError';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type PowerPlant = {
  __typename?: 'PowerPlant';
  address: Scalars['String'];
  annualPowerGeneration: Scalars['Int'];
  createdAt: Scalars['DateTime'];
  createdBy?: Maybe<Scalars['String']>;
  estimatedAnnualPowerGeneration: Scalars['Int'];
  /** 電廠預計年供電量 */
  estimatedAnnualPowerSupply: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  number: Scalars['String'];
  transferRate: Scalars['Int'];
  volume: Scalars['Int'];
};

export type PowerPlantPage = {
  __typename?: 'PowerPlantPage';
  list: Array<PowerPlant>;
  total: Scalars['Int'];
};

export type Query = {
  __typename?: 'Query';
  accounts: AccountPage;
  adminPermissions: Array<RoleInfo>;
  admins: AdminPage;
  companies: CompanyPage;
  company: Company;
  companyContract: CompanyContract;
  companyContracts: CompanyContractPage;
  dashboard: Dashboard;
  fee: Fee;
  guest: Guest;
  guests: GuestPage;
  me?: Maybe<Account>;
  powerPlant: PowerPlant;
  powerPlants: PowerPlantPage;
  tpcBill: TpcBill;
  tpcBills: TpcBillPage;
  transferDocument: TransferDocument;
  transferDocuments: TransferDocumentPage;
  user: User;
  userBill: UserBill;
  userBills: UserBillPage;
  userContract: UserContract;
  userContracts: UserContractPage;
  users: UserPage;
};


export type QueryAccountsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryAdminsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  role?: InputMaybe<AdminRole>;
};


export type QueryCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryCompanyArgs = {
  id: Scalars['UUID'];
};


export type QueryCompanyContractArgs = {
  id: Scalars['UUID'];
};


export type QueryCompanyContractsArgs = {
  companyId: Scalars['ID'];
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryGuestArgs = {
  id: Scalars['UUID'];
};


export type QueryGuestsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  roles?: Array<Role>;
};


export type QueryPowerPlantArgs = {
  id: Scalars['UUID'];
};


export type QueryPowerPlantsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryTpcBillArgs = {
  id: Scalars['UUID'];
};


export type QueryTpcBillsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryTransferDocumentArgs = {
  id: Scalars['UUID'];
};


export type QueryTransferDocumentsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryUserArgs = {
  id: Scalars['UUID'];
};


export type QueryUserBillArgs = {
  id: Scalars['UUID'];
};


export type QueryUserBillsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
};


export type QueryUserContractArgs = {
  id: Scalars['UUID'];
};


export type QueryUserContractsArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  userId?: InputMaybe<Scalars['UUID']>;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']>;
  offset?: InputMaybe<Scalars['Int']>;
  roles?: Array<Role>;
};

export type RecipientAccount = {
  __typename?: 'RecipientAccount';
  /** 帳號 */
  account: Scalars['String'];
  /** 戶名 */
  accountName: Scalars['String'];
  /** 分行代碼 */
  bankBranchCode: Scalars['String'];
  /** 分行名稱 */
  bankBranchName: Scalars['String'];
  /** 銀行代碼 */
  bankCode: Scalars['String'];
  /** 銀行名稱 */
  bankName: Scalars['String'];
};

export type RemoveAccountInput = {
  accountId: Scalars['ID'];
  reason?: InputMaybe<Scalars['String']>;
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

export type RemoveGuestInput = {
  guestId: Scalars['UUID'];
  reason: Scalars['String'];
};

export type RemoveUserInput = {
  userId: Scalars['UUID'];
};

export type RequestResetPasswordResponse = AccountNotFoundError | InvalidSignInInputError | PasswordReset;

export type ResetPasswordResponse = PasswordResetExpiredError | Success;

export enum Role {
  Admin = 'ADMIN',
  Company = 'COMPANY',
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

export type SignInResponse = Admin | Guest | InvalidSignInInputError;

export type Success = {
  __typename?: 'Success';
  id: Scalars['ID'];
  message: Scalars['String'];
};

export type TpcBill = {
  __typename?: 'TPCBill';
  billDoc: Scalars['String'];
  billReceivedDate: Scalars['DateTime'];
  id: Scalars['ID'];
  transferDegrees: Array<TransferDegree>;
};

export type TpcBillPage = {
  __typename?: 'TPCBillPage';
  list: Array<TpcBill>;
  total: Scalars['Int'];
};

export type TransferDegree = {
  __typename?: 'TransferDegree';
  createdAt: Scalars['DateTime'];
  degree: Scalars['Int'];
  id: Scalars['ID'];
  powerPlant: PowerPlant;
  user: User;
  userContract: UserContract;
};

export type TransferDocument = {
  __typename?: 'TransferDocument';
  contractCompletionDate?: Maybe<Scalars['DateTime']>;
  contractReviewDate?: Maybe<Scalars['DateTime']>;
  /** 期望完成日：這份轉供合約涵蓋的用戶契約，在契約中約定的約定轉供日 */
  expectedTime: Scalars['DateTime'];
  formalDoc: Scalars['String'];
  id: Scalars['ID'];
  name: Scalars['String'];
  /** 契約編號 */
  number?: Maybe<Scalars['String']>;
  officialTransferDate?: Maybe<Scalars['DateTime']>;
  planSubmissionDate?: Maybe<Scalars['DateTime']>;
  printingDoc: Scalars['String'];
  receptionAreas: Scalars['String'];
  replyDoc: Scalars['String'];
  responseAcquisitionDate?: Maybe<Scalars['DateTime']>;
  transferDocumentPowerPlants: Array<TransferDocumentPowerPlant>;
  transferDocumentUsers: Array<TransferDocumentUser>;
  wordDoc: Scalars['String'];
};

export type TransferDocumentPage = {
  __typename?: 'TransferDocumentPage';
  list: Array<TransferDocument>;
  total: Scalars['Int'];
};

export type TransferDocumentPowerPlant = {
  __typename?: 'TransferDocumentPowerPlant';
  estimateAnnualSupply: Scalars['Int'];
  powerPlant: PowerPlant;
  transferRate: Scalars['Int'];
};

export type TransferDocumentUser = {
  __typename?: 'TransferDocumentUser';
  electricNumberInfo: ElectricNumberInfo;
  expectedYearlyPurchaseDegree: Scalars['Int'];
  monthlyTransferDegree: Scalars['Int'];
  user: User;
  userContract: UserContract;
  yearlyTransferDegree: Scalars['Int'];
};

export type UpdateCompanyContractInput = {
  companyContractId: Scalars['ID'];
  contactEmail?: InputMaybe<Scalars['String']>;
  contactName?: InputMaybe<Scalars['String']>;
  contactPhone?: InputMaybe<Scalars['String']>;
  contractDoc?: InputMaybe<Scalars['String']>;
  contractTimeType: ContractTimeType;
  daysToPay?: InputMaybe<Scalars['Int']>;
  description?: InputMaybe<Scalars['String']>;
  duration?: InputMaybe<Scalars['String']>;
  endedAt?: InputMaybe<Scalars['DateTime']>;
  industryDoc?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  number?: InputMaybe<Scalars['String']>;
  price?: InputMaybe<Scalars['String']>;
  startedAt?: InputMaybe<Scalars['DateTime']>;
  transferAt?: InputMaybe<Scalars['DateTime']>;
  transferDoc?: InputMaybe<Scalars['String']>;
  transferRate?: InputMaybe<Scalars['Int']>;
};

export type UpdateCompanyInput = {
  companyId: Scalars['ID'];
  contactEmail?: InputMaybe<Scalars['String']>;
  contactName?: InputMaybe<Scalars['String']>;
  contactPhone?: InputMaybe<Scalars['String']>;
  name?: InputMaybe<Scalars['String']>;
  taxId?: InputMaybe<Scalars['String']>;
};

export type UpdateFeeInput = {
  certificateServiceFee?: InputMaybe<Scalars['String']>;
  certificateVerificationFee?: InputMaybe<Scalars['String']>;
  substitutionFee?: InputMaybe<Scalars['String']>;
};

export type UpdatePowerPlantInput = {
  address: Scalars['String'];
  estimatedAnnualPowerGeneration: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  number: Scalars['String'];
  transferRate: Scalars['Int'];
  volume: Scalars['Int'];
};

export type UpdateRecipientAccountInput = {
  account: Scalars['String'];
  accountName: Scalars['String'];
  bankBranchCode: Scalars['String'];
  bankCode: Scalars['String'];
};

export type UpdateTransferDocumentInput = {
  expectedTime: Scalars['DateTime'];
  formalDoc: Scalars['String'];
  name: Scalars['String'];
  number: Scalars['String'];
  powerPlants: Array<CreateTransferDocumentPowerPlantInput>;
  printingDoc: Scalars['String'];
  receptionAreas: Scalars['String'];
  replyDoc: Scalars['String'];
  users: Array<CreateTransferDocumentUserInput>;
  wordDoc: Scalars['String'];
};

export type UpdateTransferDocumentStageInput = {
  date: Scalars['DateTime'];
  number?: InputMaybe<Scalars['String']>;
};

export type User = {
  __typename?: 'User';
  bankAccounts: Array<BankAccount>;
  companyAddress: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  estimatedTransferDegree: Scalars['Int'];
  /** 用戶預計年採購度數 */
  expectedYearlyPurchaseDegree: Scalars['Int'];
  id: Scalars['ID'];
  lastMonthTransferRecords: Array<TransferDegree>;
  name: Scalars['String'];
  notes?: Maybe<Scalars['String']>;
  thisYearTransferRecords: Array<TransferDegree>;
  warning?: Maybe<Scalars['String']>;
};

export type UserBill = {
  __typename?: 'UserBill';
  address: Scalars['String'];
  contactEmail: Scalars['String'];
  contactName: Scalars['String'];
  contactPhone: Scalars['String'];
  credentialInspectionFee: ChargeType;
  credentialServiceFee: ChargeType;
  electricNumberInfos: Array<UserBillElectricNumberInfo>;
  /** 預計電費單寄出期限（收到繳費通知單後天數 */
  estimatedBillDeliverDate: Scalars['Int'];
  id: Scalars['ID'];
  name: Scalars['String'];
  noticeForTPCBill: Scalars['Boolean'];
  noticeForTheBuilding: Scalars['Boolean'];
  /** 用戶繳費期限（收到繳費通知單後天數） */
  paymentDeadline: Scalars['Int'];
  recipientAccount: UserBillRecipientAccount;
  transportationFee: ChargeType;
  user: User;
};

export type UserBillElectricNumberInfo = {
  __typename?: 'UserBillElectricNumberInfo';
  number: Scalars['String'];
  /** 採購電價（元/kWh） */
  price: Scalars['String'];
};

export type UserBillPage = {
  __typename?: 'UserBillPage';
  list: Array<UserBill>;
  total: Scalars['Int'];
};

export type UserBillRecipientAccount = {
  __typename?: 'UserBillRecipientAccount';
  /** 帳號 */
  account: Scalars['String'];
  /** 分行代碼 */
  bankBranchCode: Scalars['String'];
  /** 銀行代碼 */
  bankCode: Scalars['String'];
};

export type UserBillRecipientAccountInput = {
  /** 帳號 */
  account: Scalars['String'];
  /** 銀行代碼 */
  bankCode: Scalars['String'];
};

export type UserContract = {
  __typename?: 'UserContract';
  contractDoc: Scalars['String'];
  /** 電號資訊 */
  electricNumberInfos: Array<ElectricNumberInfo>;
  id: Scalars['ID'];
  lowerLimit: Scalars['Int'];
  name: Scalars['String'];
  price: Scalars['String'];
  purchaseDegree: Scalars['Int'];
  salesPeriod: Scalars['String'];
  serialNumber: Scalars['String'];
  transferAt?: Maybe<Scalars['DateTime']>;
  upperLimit: Scalars['Int'];
  userType: UserType;
};

export type UserContractPage = {
  __typename?: 'UserContractPage';
  list: Array<UserContract>;
  total: Scalars['Int'];
};

export type UserPage = {
  __typename?: 'UserPage';
  list: Array<User>;
  total: Scalars['Int'];
};

export enum UserType {
  Multiple = 'MULTIPLE',
  Single = 'SINGLE'
}
