export type Maybe<T> = T | undefined;
export type InputMaybe<T> = T | undefined;
export type Exact<T extends { [key: string]: unknown }> = { [K in keyof T]: T[K] };
export type MakeOptional<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]?: Maybe<T[SubKey]> };
export type MakeMaybe<T, K extends keyof T> = Omit<T, K> & { [SubKey in K]: Maybe<T[SubKey]> };
export type MakeEmpty<T extends { [key: string]: unknown }, K extends keyof T> = { [_ in K]?: never };
export type Incremental<T> = T | { [P in keyof T]?: P extends ' $fragmentName' | '__typename' ? T[P] : never };
/** All built-in and custom scalars, mapped to their actual values */
export type Scalars = {
  ID: { input: string; output: string; }
  String: { input: string; output: string; }
  Boolean: { input: boolean; output: boolean; }
  Int: { input: number; output: number; }
  Float: { input: number; output: number; }
  DateTime: { input: any; output: any; }
  UUID: { input: any; output: any; }
};

export type Account = {
  actions: Array<Action>;
  company?: Maybe<Company>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<Admin>;
  email: Scalars['String']['output'];
  hasSetPassword: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipientAccounts?: Maybe<Array<RecipientAccount>>;
  removeRecord?: Maybe<RemoveAccountRecord>;
  role: Role;
  user?: Maybe<User>;
};

export type AccountAlreadyExistsError = Error & {
  __typename?: 'AccountAlreadyExistsError';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type AccountNotFoundError = Error & {
  __typename?: 'AccountNotFoundError';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type AccountPage = {
  __typename?: 'AccountPage';
  list: Array<Account>;
  total: Scalars['Int']['output'];
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
  company?: Maybe<Company>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<Admin>;
  email: Scalars['String']['output'];
  hasSetPassword: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipientAccounts?: Maybe<Array<RecipientAccount>>;
  removeRecord?: Maybe<RemoveAccountRecord>;
  role: Role;
  user?: Maybe<User>;
};

export type AdminPage = {
  __typename?: 'AdminPage';
  list: Array<Admin>;
  total: Scalars['Int']['output'];
};

export enum AdminRole {
  Admin = 'ADMIN',
  SuperAdmin = 'SUPER_ADMIN'
}

export type BankAccount = {
  __typename?: 'BankAccount';
  /** 帳號 */
  account: Scalars['String']['output'];
  /** 戶名 */
  accountName: Scalars['String']['output'];
  /** 分行代碼 */
  bankBranchCode: Scalars['String']['output'];
  /** 分行名稱 */
  bankBranchName: Scalars['String']['output'];
  /** 銀行代碼 */
  bankCode: Scalars['String']['output'];
  /** 銀行名稱 */
  bankName: Scalars['String']['output'];
  /** 統一編號 */
  taxId: Scalars['String']['output'];
};

export type BankAccountInput = {
  account: Scalars['String']['input'];
  accountName: Scalars['String']['input'];
  bankBranchCode: Scalars['String']['input'];
  bankCode: Scalars['String']['input'];
  taxId?: InputMaybe<Scalars['String']['input']>;
};

export type ChangePasswordResponse = Admin | InvalidCurrentPasswordError;

export enum ChargeType {
  Self = 'SELF',
  User = 'USER'
}

export type Company = {
  __typename?: 'Company';
  companyContracts: Array<CompanyContract>;
  contactEmail: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipientAccounts: Array<RecipientAccount>;
  taxId: Scalars['String']['output'];
  /** 裝置量=該發電業簽署的合約裡面，所有裝置量的加總 */
  totalVolume: Scalars['Int']['output'];
};

export type CompanyContract = {
  __typename?: 'CompanyContract';
  company: Company;
  contractDoc: Scalars['String']['output'];
  contractDocName?: Maybe<Scalars['String']['output']>;
  contractTimeType: ContractTimeType;
  /** 轉供條件 */
  daysToPay: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** 合約年限 */
  duration?: Maybe<Scalars['String']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  industryDoc?: Maybe<Scalars['String']['output']>;
  industryDocName?: Maybe<Scalars['String']['output']>;
  monthlyTransferDegrees: Array<Array<TransferDegree>>;
  name: Scalars['String']['output'];
  /** 合約編號 */
  number: Scalars['String']['output'];
  /** 正式轉供日：合約裡面有複數電廠，每個電廠歸屬於不同的轉供合約，造成有多個不同的正式轉供日，那以最早取得正式轉供日的為主 */
  officialTransferDate?: Maybe<Scalars['DateTime']['output']>;
  powerPlants: Array<PowerPlant>;
  /** 合約價格 */
  price?: Maybe<Scalars['String']['output']>;
  /** 單一費率/個別費率 */
  rateType: RateType;
  startedAt: Scalars['DateTime']['output'];
  /** 裝置量=該合約所有的電廠裡面的裝置量的加總 */
  totalVolume: Scalars['Int']['output'];
  transferAt?: Maybe<Scalars['DateTime']['output']>;
  transferDoc?: Maybe<Scalars['String']['output']>;
  transferDocName?: Maybe<Scalars['String']['output']>;
  /** 轉供率要求（%） */
  transferRate: Scalars['Int']['output'];
};

export type CompanyContractPage = {
  __typename?: 'CompanyContractPage';
  list: Array<CompanyContract>;
  total: Scalars['Int']['output'];
};

export type CompanyPage = {
  __typename?: 'CompanyPage';
  list: Array<Company>;
  total: Scalars['Int']['output'];
};

export enum ContractTimeType {
  ContractEndTime = 'CONTRACT_END_TIME',
  ContractStartTime = 'CONTRACT_START_TIME',
  TransferStartTime = 'TRANSFER_START_TIME'
}

export type CreateAccountInput = {
  companyId?: InputMaybe<Scalars['String']['input']>;
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: Role;
  userId?: InputMaybe<Scalars['String']['input']>;
};

export type CreateAccountResponse = AccountAlreadyExistsError | Admin | Guest;

export type CreateAdminInput = {
  email: Scalars['String']['input'];
  name: Scalars['String']['input'];
  role: AdminRole;
};

export type CreateAdminResponse = AccountAlreadyExistsError | Admin;

export type CreateCompanyContractInput = {
  companyId: Scalars['ID']['input'];
  contractDoc: Scalars['String']['input'];
  contractDocName: Scalars['String']['input'];
  contractTimeType: ContractTimeType;
  daysToPay: Scalars['Int']['input'];
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['String']['input']>;
  endedAt?: InputMaybe<Scalars['DateTime']['input']>;
  industryDoc?: InputMaybe<Scalars['String']['input']>;
  industryDocName?: InputMaybe<Scalars['String']['input']>;
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  rateType: RateType;
  startedAt: Scalars['DateTime']['input'];
  transferDoc?: InputMaybe<Scalars['String']['input']>;
  transferDocName?: InputMaybe<Scalars['String']['input']>;
  transferRate: Scalars['Int']['input'];
};

export type CreateCompanyInput = {
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  name: Scalars['String']['input'];
  taxId: Scalars['String']['input'];
};

export type CreatePowerPlantInput = {
  address: Scalars['String']['input'];
  companyContractId: Scalars['ID']['input'];
  energyType: EnergyType;
  estimatedAnnualPowerGeneration: Scalars['Int']['input'];
  generationType: GenerationType;
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  recipientAccount?: InputMaybe<RecipientAccountInput>;
  transferRate: Scalars['Int']['input'];
  volume: Scalars['Int']['input'];
};

export type CreateRecipientAccountInput = {
  /** 帳號 */
  account: Scalars['String']['input'];
  /** 戶名 */
  accountName: Scalars['String']['input'];
  /** 分行代碼 */
  bankBranchCode?: Scalars['String']['input'];
  /** 銀行代碼 */
  bankCode: Scalars['String']['input'];
};

export type CreateTpcBillInput = {
  billDoc: Scalars['String']['input'];
  billReceivedDate: Scalars['DateTime']['input'];
  billingDate: Scalars['DateTime']['input'];
  transferDegrees: Array<CreateTransferDegreeInput>;
  transferDocumentId: Scalars['ID']['input'];
};

export type CreateTransferDegreeInput = {
  degree: Scalars['Int']['input'];
  powerPlantId: Scalars['ID']['input'];
  userContractId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
};

export type CreateTransferDocumentInput = {
  expectedTime: Scalars['DateTime']['input'];
  formalDoc: Scalars['String']['input'];
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  powerPlants: Array<CreateTransferDocumentPowerPlantInput>;
  printingDoc: Scalars['String']['input'];
  receptionAreas: Scalars['String']['input'];
  replyDoc: Scalars['String']['input'];
  users: Array<CreateTransferDocumentUserInput>;
  wordDoc: Scalars['String']['input'];
};

export type CreateTransferDocumentPowerPlantInput = {
  estimateAnnualSupply: Scalars['Int']['input'];
  powerPlantId: Scalars['ID']['input'];
  transferRate: Scalars['Int']['input'];
};

export type CreateTransferDocumentUserInput = {
  electricNumber: Scalars['String']['input'];
  /** 要小於電號的電號年預計採購度數 */
  expectedYearlyPurchaseDegree?: InputMaybe<Scalars['Int']['input']>;
  monthlyTransferDegree: Scalars['Int']['input'];
  userContractId: Scalars['ID']['input'];
  userId: Scalars['ID']['input'];
  yearlyTransferDegree: Scalars['Int']['input'];
};

export type CreateUserBillInput = {
  address: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  credentialInspectionFee: ChargeType;
  credentialServiceFee: ChargeType;
  electricNumbers: Array<Scalars['String']['input']>;
  /** 預計電費單寄出期限（收到繳費通知單後天數 */
  estimatedBillDeliverDate: Scalars['Float']['input'];
  name: Scalars['String']['input'];
  noticeForTPCBill: Scalars['Boolean']['input'];
  noticeForTheBuilding: Scalars['Boolean']['input'];
  /** 用戶繳費期限（收到繳費通知單後天數） */
  paymentDeadline: Scalars['Float']['input'];
  recipientAccount: RecipientAccountInput;
  transportationFee: ChargeType;
  userId: Scalars['String']['input'];
};

export type CreateUserContractInput = {
  contractDoc: Scalars['String']['input'];
  contractDocName: Scalars['String']['input'];
  electricNumberInfos: Array<ElectricNumberInfoInput>;
  lowerLimit?: InputMaybe<Scalars['Int']['input']>;
  name: Scalars['String']['input'];
  price: Scalars['Float']['input'];
  purchaseDegree: Scalars['Int']['input'];
  salesAt: Scalars['DateTime']['input'];
  salesPeriod: Scalars['String']['input'];
  serialNumber: Scalars['String']['input'];
  transferAt?: InputMaybe<Scalars['DateTime']['input']>;
  upperLimit?: InputMaybe<Scalars['Int']['input']>;
  userType: UserType;
};

export type CreateUserInput = {
  bankAccounts: Array<BankAccountInput>;
  companyAddress: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  warning?: InputMaybe<Scalars['String']['input']>;
};

export type Dashboard = {
  __typename?: 'Dashboard';
  companyContractInfo: DashboardCompanyContract;
  companyInfo: DashboardCompany;
  powerPlantInfo: DashboardPowerPlant;
  tpcBillInfo: DashboardTpcBill;
  transferDegreeInfo: DashboardTransferDegree;
  userBillInfo: DashboardUserBill;
  userContractInfo: DashboardUserContract;
  userInfo: DashboardUser;
};

export type DashboardCompany = {
  __typename?: 'DashboardCompany';
  /** 平均購買價格 */
  averagePurchasePrice: Scalars['String']['output'];
  /** 發電業數量 */
  totalCompanies: Scalars['Int']['output'];
  /** 電廠數量 */
  totalPowerPlants: Scalars['Int']['output'];
  totalVolume: Scalars['String']['output'];
};

export type DashboardCompanyContract = {
  __typename?: 'DashboardCompanyContract';
  /** 容量剩餘發電業名單 */
  remainingDemandFromCompanyContracts: Array<RemainingDemandFromCompanyContract>;
};

export type DashboardPowerPlant = {
  __typename?: 'DashboardPowerPlant';
  /** 容量剩餘發電業名單 */
  remainingDemandFromPowerPlant: PowerPlant;
};

export type DashboardTpcBill = {
  __typename?: 'DashboardTPCBill';
  monthlyTPCBillTransferDegrees: Array<Scalars['Int']['output']>;
};

export type DashboardTransferDegree = {
  __typename?: 'DashboardTransferDegree';
  /** 轉供度數 */
  monthlyTransferDegree: Array<Scalars['Int']['output']>;
};

export type DashboardUser = {
  __typename?: 'DashboardUser';
  count: Scalars['Int']['output'];
  /** 總綠電需求度數 */
  totalRequireDegree: Scalars['Int']['output'];
  /** 年度用戶成長數 */
  yearlyGrowth: Scalars['Int']['output'];
};

export type DashboardUserBill = {
  __typename?: 'DashboardUserBill';
  /** 營業額 */
  turnover: Array<Scalars['Int']['output']>;
};

export type DashboardUserContract = {
  __typename?: 'DashboardUserContract';
  /** 平均售電價格 */
  averageSellingPrice: Scalars['String']['output'];
  /** 容量不足用戶名單 */
  remainingDemandFromUserContracts: Array<RemainingDemandFromUserContract>;
  /** 未來一年用戶合約到期名單 */
  userContractsExpiringSoon: Array<UserContract>;
};

export type ElectricNumberInfo = {
  __typename?: 'ElectricNumberInfo';
  address: Scalars['String']['output'];
  companyAddress?: Maybe<Scalars['String']['output']>;
  contactEmail: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  degree: Scalars['Int']['output'];
  number: Scalars['String']['output'];
  recipientAccount?: Maybe<RecipientAccount>;
  tableNumbers: Array<Scalars['String']['output']>;
};

export type ElectricNumberInfoInput = {
  address: Scalars['String']['input'];
  companyAddress: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  degree: Scalars['Int']['input'];
  number: Scalars['String']['input'];
  recipientAccount?: InputMaybe<CreateRecipientAccountInput>;
  tableNumbers: Array<Scalars['String']['input']>;
};

export enum EnergyType {
  OtherRenewable = 'OTHER_RENEWABLE',
  Solar = 'SOLAR',
  Wind = 'WIND'
}

export type Error = {
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type Fee = {
  __typename?: 'Fee';
  /** 憑證服務費 */
  certificateServiceFee: Scalars['String']['output'];
  /** 憑證審查費 */
  certificateVerificationFee: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  /** 代輸費 */
  substitutionFee: Scalars['String']['output'];
  updatedAt: Scalars['DateTime']['output'];
};

export enum GenerationType {
  TypeI = 'TYPE_I',
  TypeIi = 'TYPE_II',
  TypeIii = 'TYPE_III'
}

export type Guest = Account & {
  __typename?: 'Guest';
  actions: Array<Action>;
  company?: Maybe<Company>;
  companyName?: Maybe<Scalars['String']['output']>;
  createdAt: Scalars['DateTime']['output'];
  creator?: Maybe<Admin>;
  email: Scalars['String']['output'];
  hasSetPassword: Scalars['Boolean']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  recipientAccounts?: Maybe<Array<RecipientAccount>>;
  removeRecord?: Maybe<RemoveAccountRecord>;
  role: Role;
  user?: Maybe<User>;
};

export type GuestPage = {
  __typename?: 'GuestPage';
  list: Array<Guest>;
  total: Scalars['Int']['output'];
};

export type InvalidCurrentPasswordError = Error & {
  __typename?: 'InvalidCurrentPasswordError';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type InvalidSignInInputError = Error & {
  __typename?: 'InvalidSignInInputError';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type ModifyUserInput = {
  bankAccounts: Array<BankAccountInput>;
  companyAddress: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  name: Scalars['String']['input'];
  notes?: InputMaybe<Scalars['String']['input']>;
  warning?: InputMaybe<Scalars['String']['input']>;
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
  removeCompany: Company;
  removeCompanyContract: CompanyContract;
  removeGuest: Guest;
  removePowerPlant: PowerPlant;
  removeTPCBill: TpcBill;
  removeTransferDocument: TransferDocument;
  removeUser: User;
  removeUserBill: UserBill;
  removeUserContract: UserContract;
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
  updateUserBill: UserBill;
  updateUserContract: UserContract;
};


export type MutationChangePasswordArgs = {
  currentPassword: Scalars['String']['input'];
  newPassword: Scalars['String']['input'];
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
  userId: Scalars['String']['input'];
};


export type MutationModifyAccountArgs = {
  companyId?: InputMaybe<Scalars['ID']['input']>;
  email?: InputMaybe<Scalars['String']['input']>;
  id: Scalars['ID']['input'];
  name?: InputMaybe<Scalars['String']['input']>;
  recipientAccounts?: InputMaybe<Array<CreateRecipientAccountInput>>;
  userId?: InputMaybe<Scalars['ID']['input']>;
};


export type MutationModifyProfileArgs = {
  email?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  recipientAccounts?: InputMaybe<Array<CreateRecipientAccountInput>>;
};


export type MutationModifyUserArgs = {
  id: Scalars['UUID']['input'];
  input: ModifyUserInput;
};


export type MutationRemoveAccountArgs = {
  input: RemoveAccountInput;
};


export type MutationRemoveAdminArgs = {
  input: RemoveAdminInput;
};


export type MutationRemoveCompanyArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationRemoveCompanyContractArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationRemoveGuestArgs = {
  input: RemoveGuestInput;
};


export type MutationRemovePowerPlantArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationRemoveTpcBillArgs = {
  input: RemoveTpcBillInput;
};


export type MutationRemoveTransferDocumentArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationRemoveUserArgs = {
  input: RemoveUserInput;
};


export type MutationRemoveUserBillArgs = {
  input: RemoveUserBillInput;
};


export type MutationRemoveUserContractArgs = {
  id: Scalars['UUID']['input'];
};


export type MutationRequestResetPasswordArgs = {
  id: Scalars['ID']['input'];
  oldPassword: Scalars['String']['input'];
};


export type MutationResetPasswordArgs = {
  newPassword: Scalars['String']['input'];
  token: Scalars['ID']['input'];
};


export type MutationSendResetPasswordEmailArgs = {
  id: Scalars['ID']['input'];
};


export type MutationSetPasswordArgs = {
  newPassword: Scalars['String']['input'];
};


export type MutationSignInArgs = {
  email: Scalars['String']['input'];
  password: Scalars['String']['input'];
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
  id: Scalars['UUID']['input'];
  input: UpdateTransferDocumentInput;
};


export type MutationUpdateTransferDocumentStageArgs = {
  id: Scalars['UUID']['input'];
  input?: InputMaybe<UpdateTransferDocumentStageInput>;
  moveNextStep: Scalars['Boolean']['input'];
};


export type MutationUpdateUserBillArgs = {
  input: UpdateUserBillInput;
};


export type MutationUpdateUserContractArgs = {
  input: UpdateUserContractInput;
};

export type PasswordReset = {
  __typename?: 'PasswordReset';
  id: Scalars['ID']['output'];
};

export type PasswordResetExpiredError = Error & {
  __typename?: 'PasswordResetExpiredError';
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type PowerPlant = {
  __typename?: 'PowerPlant';
  address: Scalars['String']['output'];
  companyContractId: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  createdBy?: Maybe<Scalars['String']['output']>;
  energyType: EnergyType;
  estimatedAnnualPowerGeneration: Scalars['Int']['output'];
  /** 電廠預計年供電量 */
  estimatedAnnualPowerSupply: Scalars['String']['output'];
  generationType: GenerationType;
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  number: Scalars['String']['output'];
  price: Scalars['String']['output'];
  recipientAccount?: Maybe<PowerPlantRecipientAccount>;
  supplyVolume: Scalars['Int']['output'];
  /** 供電容量比例 */
  transferRate: Scalars['Int']['output'];
  /** 電廠裝置容量 */
  volume: Scalars['Int']['output'];
};

export type PowerPlantPage = {
  __typename?: 'PowerPlantPage';
  list: Array<PowerPlant>;
  total: Scalars['Int']['output'];
};

export type PowerPlantRecipientAccount = {
  __typename?: 'PowerPlantRecipientAccount';
  /** 帳號 */
  account: Scalars['String']['output'];
  /** 銀行代碼 */
  bankCode: Scalars['String']['output'];
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
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryAdminsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  role?: InputMaybe<AdminRole>;
};


export type QueryCompaniesArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  search?: InputMaybe<Scalars['String']['input']>;
};


export type QueryCompanyArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCompanyContractArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryCompanyContractsArgs = {
  companyId: Scalars['ID']['input'];
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryGuestArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryGuestsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  roles?: Array<Role>;
};


export type QueryPowerPlantArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryPowerPlantsArgs = {
  companyContractId?: InputMaybe<Scalars['UUID']['input']>;
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryTpcBillArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryTpcBillsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  transferDocumentId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryTransferDocumentArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryTransferDocumentsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserBillArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserBillsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
};


export type QueryUserContractArgs = {
  id: Scalars['UUID']['input'];
};


export type QueryUserContractsArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  userId?: InputMaybe<Scalars['UUID']['input']>;
};


export type QueryUsersArgs = {
  limit?: InputMaybe<Scalars['Int']['input']>;
  offset?: InputMaybe<Scalars['Int']['input']>;
  roles?: Array<Role>;
};

export enum RateType {
  Individual = 'INDIVIDUAL',
  Single = 'SINGLE'
}

export type RecipientAccount = {
  __typename?: 'RecipientAccount';
  /** 帳號 */
  account: Scalars['String']['output'];
  /** 戶名 */
  accountName?: Maybe<Scalars['String']['output']>;
  /** 分行代碼 */
  bankBranchCode?: Maybe<Scalars['String']['output']>;
  /** 分行名稱 */
  bankBranchName?: Maybe<Scalars['String']['output']>;
  /** 銀行代碼 */
  bankCode: Scalars['String']['output'];
  /** 銀行名稱 */
  bankName?: Maybe<Scalars['String']['output']>;
};

export type RecipientAccountInput = {
  /** 帳號 */
  account: Scalars['String']['input'];
  /** 銀行代碼 */
  bankCode: Scalars['String']['input'];
};

export type RemainingDemandFromCompanyContract = {
  __typename?: 'RemainingDemandFromCompanyContract';
  capacity: Scalars['Int']['output'];
  company: Company;
  contractDoc: Scalars['String']['output'];
  contractDocName?: Maybe<Scalars['String']['output']>;
  contractTimeType: ContractTimeType;
  /** 轉供條件 */
  daysToPay: Scalars['Int']['output'];
  description?: Maybe<Scalars['String']['output']>;
  /** 合約年限 */
  duration?: Maybe<Scalars['String']['output']>;
  endedAt?: Maybe<Scalars['DateTime']['output']>;
  id: Scalars['ID']['output'];
  industryDoc?: Maybe<Scalars['String']['output']>;
  industryDocName?: Maybe<Scalars['String']['output']>;
  monthlyTransferDegrees: Array<Array<TransferDegree>>;
  name: Scalars['String']['output'];
  /** 合約編號 */
  number: Scalars['String']['output'];
  /** 正式轉供日：合約裡面有複數電廠，每個電廠歸屬於不同的轉供合約，造成有多個不同的正式轉供日，那以最早取得正式轉供日的為主 */
  officialTransferDate?: Maybe<Scalars['DateTime']['output']>;
  powerPlants: Array<PowerPlant>;
  /** 合約價格 */
  price?: Maybe<Scalars['String']['output']>;
  /** 單一費率/個別費率 */
  rateType: RateType;
  startedAt: Scalars['DateTime']['output'];
  /** 裝置量=該合約所有的電廠裡面的裝置量的加總 */
  totalVolume: Scalars['Int']['output'];
  transferAt?: Maybe<Scalars['DateTime']['output']>;
  transferDoc?: Maybe<Scalars['String']['output']>;
  transferDocName?: Maybe<Scalars['String']['output']>;
  /** 轉供率要求（%） */
  transferRate: Scalars['Int']['output'];
};

export type RemainingDemandFromUserContract = {
  __typename?: 'RemainingDemandFromUserContract';
  capacity: Scalars['Int']['output'];
  contractDoc: Scalars['String']['output'];
  contractDocName: Scalars['String']['output'];
  contractTimeType: ContractTimeType;
  /** 電號資訊 */
  electricNumberInfos: Array<ElectricNumberInfo>;
  id: Scalars['ID']['output'];
  lowerLimit?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['String']['output'];
  purchaseDegree: Scalars['Int']['output'];
  salesAt: Scalars['DateTime']['output'];
  salesPeriod: Scalars['String']['output'];
  salesTo?: Maybe<Scalars['DateTime']['output']>;
  serialNumber: Scalars['String']['output'];
  transferAt?: Maybe<Scalars['DateTime']['output']>;
  upperLimit?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  userType: UserType;
};

export type RemoveAccountInput = {
  accountId: Scalars['ID']['input'];
  reason?: InputMaybe<Scalars['String']['input']>;
};

export type RemoveAccountRecord = {
  __typename?: 'RemoveAccountRecord';
  account: Account;
  createdAt: Scalars['DateTime']['output'];
  creator: Account;
  reason: Scalars['String']['output'];
};

export type RemoveAdminInput = {
  adminId: Scalars['ID']['input'];
  reason: Scalars['String']['input'];
};

export type RemoveGuestInput = {
  guestId: Scalars['UUID']['input'];
  reason: Scalars['String']['input'];
};

export type RemoveTpcBillInput = {
  tpcBillId: Scalars['UUID']['input'];
};

export type RemoveUserBillInput = {
  userBillId: Scalars['UUID']['input'];
};

export type RemoveUserInput = {
  userId: Scalars['UUID']['input'];
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
  id: Scalars['ID']['output'];
  message: Scalars['String']['output'];
};

export type TpcBill = {
  __typename?: 'TPCBill';
  billDoc: Scalars['String']['output'];
  billReceivedDate: Scalars['DateTime']['output'];
  billingDate: Scalars['DateTime']['output'];
  id: Scalars['ID']['output'];
  transferDegrees: Array<TransferDegree>;
};

export type TpcBillPage = {
  __typename?: 'TPCBillPage';
  list: Array<TpcBill>;
  total: Scalars['Int']['output'];
};

export type TransferDegree = {
  __typename?: 'TransferDegree';
  createdAt: Scalars['DateTime']['output'];
  degree: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  powerPlant: PowerPlant;
  user: User;
  userContract?: Maybe<UserContract>;
};

export type TransferDocument = {
  __typename?: 'TransferDocument';
  contractCompletionDate?: Maybe<Scalars['DateTime']['output']>;
  contractReviewDate?: Maybe<Scalars['DateTime']['output']>;
  /** 期望完成日：這份轉供合約涵蓋的用戶契約，在契約中約定的約定轉供日 */
  expectedTime: Scalars['DateTime']['output'];
  formalDoc: Scalars['String']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  /** 轉供契約編號 */
  number?: Maybe<Scalars['String']['output']>;
  officialTransferDate?: Maybe<Scalars['DateTime']['output']>;
  planSubmissionDate?: Maybe<Scalars['DateTime']['output']>;
  printingDoc: Scalars['String']['output'];
  receptionAreas: Scalars['String']['output'];
  replyDoc: Scalars['String']['output'];
  responseAcquisitionDate?: Maybe<Scalars['DateTime']['output']>;
  transferDocumentPowerPlants: Array<TransferDocumentPowerPlant>;
  transferDocumentUsers: Array<TransferDocumentUser>;
  wordDoc: Scalars['String']['output'];
};

export type TransferDocumentPage = {
  __typename?: 'TransferDocumentPage';
  list: Array<TransferDocument>;
  total: Scalars['Int']['output'];
};

export type TransferDocumentPowerPlant = {
  __typename?: 'TransferDocumentPowerPlant';
  estimateAnnualSupply: Scalars['Int']['output'];
  powerPlant: PowerPlant;
  transferRate: Scalars['Int']['output'];
};

export type TransferDocumentUser = {
  __typename?: 'TransferDocumentUser';
  electricNumberInfo: ElectricNumberInfo;
  expectedYearlyPurchaseDegree?: Maybe<Scalars['Int']['output']>;
  monthlyTransferDegree: Scalars['Int']['output'];
  user: User;
  userContract: UserContract;
  yearlyTransferDegree: Scalars['Int']['output'];
};

export type UpdateCompanyContractInput = {
  companyContractId: Scalars['ID']['input'];
  contractDoc?: InputMaybe<Scalars['String']['input']>;
  contractDocName?: InputMaybe<Scalars['String']['input']>;
  contractTimeType: ContractTimeType;
  daysToPay?: InputMaybe<Scalars['Int']['input']>;
  description?: InputMaybe<Scalars['String']['input']>;
  duration?: InputMaybe<Scalars['String']['input']>;
  endedAt?: InputMaybe<Scalars['DateTime']['input']>;
  industryDoc?: InputMaybe<Scalars['String']['input']>;
  industryDocName?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  number?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['String']['input']>;
  startedAt?: InputMaybe<Scalars['DateTime']['input']>;
  transferAt?: InputMaybe<Scalars['DateTime']['input']>;
  transferDoc?: InputMaybe<Scalars['String']['input']>;
  transferDocName?: InputMaybe<Scalars['String']['input']>;
  transferRate?: InputMaybe<Scalars['Int']['input']>;
};

export type UpdateCompanyInput = {
  companyId: Scalars['ID']['input'];
  contactEmail?: InputMaybe<Scalars['String']['input']>;
  contactName?: InputMaybe<Scalars['String']['input']>;
  contactPhone?: InputMaybe<Scalars['String']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  recipientAccounts: Array<CreateRecipientAccountInput>;
  taxId?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateFeeInput = {
  certificateServiceFee?: InputMaybe<Scalars['String']['input']>;
  certificateVerificationFee?: InputMaybe<Scalars['String']['input']>;
  substitutionFee?: InputMaybe<Scalars['String']['input']>;
};

export type UpdatePowerPlantInput = {
  address: Scalars['String']['input'];
  energyType?: InputMaybe<EnergyType>;
  estimatedAnnualPowerGeneration: Scalars['Int']['input'];
  generationType?: InputMaybe<GenerationType>;
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  number: Scalars['String']['input'];
  price?: InputMaybe<Scalars['String']['input']>;
  recipientAccount?: InputMaybe<RecipientAccountInput>;
  transferRate: Scalars['Int']['input'];
  volume: Scalars['Int']['input'];
};

export type UpdateTransferDocumentInput = {
  expectedTime: Scalars['DateTime']['input'];
  formalDoc: Scalars['String']['input'];
  name: Scalars['String']['input'];
  powerPlants: Array<CreateTransferDocumentPowerPlantInput>;
  printingDoc: Scalars['String']['input'];
  receptionAreas: Scalars['String']['input'];
  replyDoc: Scalars['String']['input'];
  users: Array<CreateTransferDocumentUserInput>;
  wordDoc: Scalars['String']['input'];
};

export type UpdateTransferDocumentStageInput = {
  companyContractId?: InputMaybe<Scalars['String']['input']>;
  date: Scalars['DateTime']['input'];
  number?: InputMaybe<Scalars['String']['input']>;
};

export type UpdateUserBillInput = {
  address: Scalars['String']['input'];
  contactEmail: Scalars['String']['input'];
  contactName: Scalars['String']['input'];
  contactPhone: Scalars['String']['input'];
  credentialInspectionFee: ChargeType;
  credentialServiceFee: ChargeType;
  electricNumbers: Array<Scalars['String']['input']>;
  /** 預計電費單寄出期限（收到繳費通知單後天數 */
  estimatedBillDeliverDate: Scalars['Float']['input'];
  id: Scalars['ID']['input'];
  name: Scalars['String']['input'];
  noticeForTPCBill: Scalars['Boolean']['input'];
  noticeForTheBuilding: Scalars['Boolean']['input'];
  /** 用戶繳費期限（收到繳費通知單後天數） */
  paymentDeadline: Scalars['Float']['input'];
  recipientAccount: RecipientAccountInput;
  transportationFee: ChargeType;
  userId: Scalars['String']['input'];
};

export type UpdateUserContractInput = {
  contractDoc?: InputMaybe<Scalars['String']['input']>;
  contractDocName?: InputMaybe<Scalars['String']['input']>;
  electricNumberInfos: Array<ElectricNumberInfoInput>;
  lowerLimit?: InputMaybe<Scalars['Int']['input']>;
  name?: InputMaybe<Scalars['String']['input']>;
  price?: InputMaybe<Scalars['Float']['input']>;
  purchaseDegree?: InputMaybe<Scalars['Int']['input']>;
  salesAt?: InputMaybe<Scalars['DateTime']['input']>;
  salesPeriod?: InputMaybe<Scalars['String']['input']>;
  serialNumber?: InputMaybe<Scalars['String']['input']>;
  transferAt?: InputMaybe<Scalars['DateTime']['input']>;
  upperLimit?: InputMaybe<Scalars['Int']['input']>;
  userContractId: Scalars['ID']['input'];
  userType?: InputMaybe<UserType>;
};

export type User = {
  __typename?: 'User';
  bankAccounts: Array<BankAccount>;
  companyAddress: Scalars['String']['output'];
  contactEmail: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  estimatedTransferDegree: Scalars['String']['output'];
  /** 用戶預計年採購度數 */
  expectedYearlyPurchaseDegree?: Maybe<Scalars['String']['output']>;
  id: Scalars['ID']['output'];
  lastMonthTransferRecords: Array<TransferDegree>;
  name: Scalars['String']['output'];
  notes?: Maybe<Scalars['String']['output']>;
  thisYearTransferRecords: Array<TransferDegree>;
  warning?: Maybe<Scalars['String']['output']>;
};

export type UserBill = {
  __typename?: 'UserBill';
  address: Scalars['String']['output'];
  contactEmail: Scalars['String']['output'];
  contactName: Scalars['String']['output'];
  contactPhone: Scalars['String']['output'];
  createdAt: Scalars['DateTime']['output'];
  credentialInspectionFee: ChargeType;
  credentialServiceFee: ChargeType;
  electricNumberInfos: Array<UserBillElectricNumberInfo>;
  /** 預計電費單寄出期限（收到繳費通知單後天數 */
  estimatedBillDeliverDate: Scalars['Int']['output'];
  id: Scalars['ID']['output'];
  name: Scalars['String']['output'];
  noticeForTPCBill: Scalars['Boolean']['output'];
  noticeForTheBuilding: Scalars['Boolean']['output'];
  /** 用戶繳費期限（收到繳費通知單後天數） */
  paymentDeadline: Scalars['Int']['output'];
  recipientAccount: UserBillRecipientAccount;
  transportationFee: ChargeType;
  user: User;
};

export type UserBillElectricNumberInfo = {
  __typename?: 'UserBillElectricNumberInfo';
  number: Scalars['String']['output'];
  /** 採購電價（元/kWh） */
  price: Scalars['String']['output'];
};

export type UserBillPage = {
  __typename?: 'UserBillPage';
  list: Array<UserBill>;
  total: Scalars['Int']['output'];
};

export type UserBillRecipientAccount = {
  __typename?: 'UserBillRecipientAccount';
  /** 帳號 */
  account: Scalars['String']['output'];
  /** 分行代碼 */
  bankBranchCode?: Maybe<Scalars['String']['output']>;
  /** 銀行代碼 */
  bankCode: Scalars['String']['output'];
};

export type UserContract = {
  __typename?: 'UserContract';
  contractDoc: Scalars['String']['output'];
  contractDocName: Scalars['String']['output'];
  contractTimeType: ContractTimeType;
  /** 電號資訊 */
  electricNumberInfos: Array<ElectricNumberInfo>;
  id: Scalars['ID']['output'];
  lowerLimit?: Maybe<Scalars['Int']['output']>;
  name: Scalars['String']['output'];
  price: Scalars['String']['output'];
  purchaseDegree: Scalars['Int']['output'];
  salesAt: Scalars['DateTime']['output'];
  salesPeriod: Scalars['String']['output'];
  salesTo?: Maybe<Scalars['DateTime']['output']>;
  serialNumber: Scalars['String']['output'];
  transferAt?: Maybe<Scalars['DateTime']['output']>;
  upperLimit?: Maybe<Scalars['Int']['output']>;
  user?: Maybe<User>;
  userType: UserType;
};

export type UserContractPage = {
  __typename?: 'UserContractPage';
  list: Array<UserContract>;
  total: Scalars['Int']['output'];
};

export type UserPage = {
  __typename?: 'UserPage';
  list: Array<User>;
  total: Scalars['Int']['output'];
};

export enum UserType {
  Multiple = 'MULTIPLE',
  Single = 'SINGLE'
}
