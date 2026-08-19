import * as yup from 'yup'
import { FieldController } from '.'
import Option from './option'
import { ApolloQueryResult } from '@apollo/client'
import { CompanyType } from '@core/graphql/types'


export enum FieldType {
  TEXT = 'TEXT',
  TEXTFILE = 'TEXTFILE',
  PASSWORD = 'PASSWORD',
  DATE = 'DATE',
  DATE_TEXTFILE = 'DATE_TEXTFILE',
  DATE_MONTH = 'DATE_MONTH',
  FILE = 'FILE',
  NUMBER = 'NUMBER',
  NUMBER_TEXTFILE = 'NUMBER_TEXTFILE',
  TEXTAREA = 'TEXTAREA',
  TEXTAREA_TEXTFILE = 'TEXTAREA_TEXTFILE',
  SINGLE_SELECT = 'SINGLE_SELECT',
  SINGLE_SELECT_TEXTFILE = 'SINGLE_SELECT_TEXTFILE',
  MULTIPLE_SELECT = 'MULTIPLE_SELECT',
  MULTIPLE_SELECT_TEXTFILE = 'MULTIPLE_SELECT_TEXTFILE',
  EMAIL = 'EMAIL',
  MOBILE = 'MOBILE',
  ADDRESS = 'ADDRESS',
  COMPONENT = 'COMPONENT',
  ACCOUNT_TYPE = 'ACCOUNT_TYPE',
  RADIO = 'RADIO',
}

interface FieldConfig {
  type:
    | 'TEXT'
    | 'TEXTFILE'
    | 'PASSWORD'
    | 'DATE'
    | 'DATE_TEXTFILE'
    | 'DATE_MONTH'
    | 'FILE'
    | 'NUMBER'
    | 'NUMBER_TEXTFILE'
    | 'TEXTAREA'
    | 'TEXTAREA_TEXTFILE'
    | 'SINGLE_SELECT'
    | 'SINGLE_SELECT_TEXTFILE'
    | 'MULTIPLE_SELECT'
    | 'MULTIPLE_SELECT_TEXTFILE'
    | 'EMAIL'
    | 'MOBILE'
    | 'ADDRESS'
    | 'COMPONENT'
    | 'ACCOUNT_TYPE'
    | 'RADIO'
  name: string
  label?: string | number | React.ReactNode
  value?: unknown
  options?: Option[]
  loading?: boolean
  disabled?: boolean
  required?: boolean
  validated?: yup.Schema<any>
  autoFocus?: boolean
  placeholder?: string
  hint?: React.ReactNode
  radios?: { label: string, value: unknown }[]
  component?: React.ComponentType<FieldController>
  fetchMoreData?: () => Promise<ApolloQueryResult<unknown>>
  onInputChange?: (value: string) => void // 搜尋輸入變化回調（用於下拉選擇框即時搜尋）
}

const requiredMessage = '此為必填欄位'

const numberValidated = yup.number().required('請輸入數字')

const numberIntegerValidated = yup
  .number()
  .required('請輸入數字')
  .integer('必須為整數');

const numberRangeValidated = yup
  .number()
  .required(requiredMessage)
  .min(0, '數字不能小於0')
  .max(100, '數字不能大於100');

const numberRangeIntegerValidated = yup
  .number()
  .required(requiredMessage)
  .integer('必須為整數')
  .min(0, '數字不能小於0')
  .max(100, '數字不能大於100');

const priceValidated = yup
  .number()
  .transform((value, originalValue) => {
    if (typeof originalValue === 'number') {
      return originalValue;
    }
    return (typeof originalValue === 'string' && originalValue.trim() === '') ? null : value;
  })
  .nullable()
  .required(requiredMessage)
  .min(0, '價格不能小於0')
  .test('is-decimal', '小數點最多後三位', value => value === null || /^\d+(\.\d{1,3})?$/.test(value.toString()));

const textValidated = yup.string().required(requiredMessage)

const emailListValidated = yup
  .string()
  .required(requiredMessage)
  .test('valid-emails', '請輸入有效的信箱格式', (value) => {
    if (!value) return false;
    const emails = value.split(/[,，]\s*/).filter(Boolean);
    if (emails.length === 0) return false;
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emails.every((email) => emailRegex.test(email));
  });

const arrayValidated = yup.array().required(requiredMessage).min(1, requiredMessage)

const objectValidated = yup.mixed().notOneOf([undefined, null], requiredMessage)

const passwordValidated = yup
  .string()
  .required(requiredMessage)
  .matches(
    /^(?=.*[A-Za-z])(?=.*\d)[\w!#$%&()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
    '密碼必須包含至少 8 個字符，其中至少包含 1 個數字 (0-9) 和 1 個字母',
  )

const checkboxValidated = yup
  .boolean()
  .required(requiredMessage)
  .oneOf([true], '請選中此框以繼續。')

const isValidUbn = (value: string): boolean => {
  const pattern = /^[0-9]{8}$/;
  if (!pattern.test(value)) return false;
  const weights = [1, 2, 1, 2, 1, 2, 4, 1];
  let sum = 0;
  for (let i = 0; i < 8; i++) {
    const product = parseInt(value[i]) * weights[i];
    sum += Math.floor(product / 10) + (product % 10);
  }
  if (parseInt(value[6]) === 7) {
    return sum % 5 === 0 || (sum + 1) % 5 === 0;
  }
  return sum % 5 === 0;
};

// 身分證首字母對照代碼；第 2 碼允許 1/2（本國籍）與 8/9（新式外來人口統一證號）
const ID_LETTER_VALUES: Record<string, number> = {
  A: 10, B: 11, C: 12, D: 13, E: 14, F: 15, G: 16, H: 17, I: 34,
  J: 18, K: 19, L: 20, M: 21, N: 22, O: 35, P: 23, Q: 24, R: 25,
  S: 26, T: 27, U: 28, V: 29, W: 32, X: 30, Y: 31, Z: 33,
};

const isValidPersonalId = (value: string): boolean => {
  if (!/^[A-Z][1289]\d{8}$/.test(value)) return false;
  const letter = ID_LETTER_VALUES[value[0]];
  const digits = [Math.floor(letter / 10), letter % 10, ...value.slice(1).split('').map(Number)];
  const weights = [1, 9, 8, 7, 6, 5, 4, 3, 2, 1, 1];
  const sum = digits.reduce((acc, d, i) => acc + d * weights[i], 0);
  return sum % 10 === 0;
};

const taiwanUBNValidation = yup.string().test(
    'is-ubn',
    '請輸入有效的台灣統一編號',
    (value) => {
      if (!value) return false;
      return isValidUbn(value);
    }
  );

// 發電業識別碼：依表單上的戶別（sibling 欄位 type）切換統編/身分證檢核
const companyIdentifierValidation = yup.string().test(
  'company-identifier',
  '請輸入有效的台灣統一編號',
  function (value) {
    const { type } = (this.parent ?? {}) as { type?: CompanyType };
    if (type === CompanyType.Individual) {
      if (!value || !isValidPersonalId(value)) {
        return this.createError({ message: '請輸入有效的身分證字號' });
      }
      return true;
    }
    if (!value || !isValidUbn(value)) {
      return this.createError({ message: '請輸入有效的台灣統一編號' });
    }
    return true;
  }
);

export {
  requiredMessage,
  numberRangeValidated,
  numberRangeIntegerValidated,
  numberValidated,
  numberIntegerValidated,
  textValidated,
  emailListValidated,
  priceValidated,
  arrayValidated,
  objectValidated,
  passwordValidated,
  checkboxValidated,
  taiwanUBNValidation,
  companyIdentifierValidation,
}

export default FieldConfig
