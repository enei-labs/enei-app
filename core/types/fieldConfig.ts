import * as yup from 'yup'
import { FieldController } from '.'
import Option from './option'


export enum FieldType {
  TEXT = 'TEXT',
  TEXTFILE = 'TEXTFILE',
  PASSWORD = 'PASSWORD',
  DATE = 'DATE',
  DATE_TEXTFILE = 'DATE_TEXTFILE',
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
  value?: any
  options?: Option[]
  loading?: boolean
  disabled?: boolean
  required?: boolean
  validated?: any
  autoFocus?: boolean
  placeholder?: string
  hint?: React.ReactNode
  radios?: { label: string, value: any }[]
  component?: React.ComponentType<FieldController>
}

const requiredMessage = '此為必填欄位'

const numberValidated = yup.number().required('請輸入數字')

const textValidated = yup.string().required(requiredMessage)

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

const taiwanUBNValidation = yup.string().test(
    'is-ubn',
    '請輸入有效的台灣統一編號',
    (value) => {
      if (!value) return false;
      const pattern = /^[0-9]{8}$/;
      if (!pattern.test(value)) return false;

      const weights = [1, 2, 1, 2, 1, 2, 4, 1];
      let sum = 0;
      for (let i = 0; i < 8; i++) {
        let product = parseInt(value[i]) * weights[i];
        if (product > 9) {
          product = Math.floor(product / 10) + (product % 10);
        }
        sum += product;
      }

      return sum % 10 === 0 || (sum % 10 === 9 && parseInt(value[6]) === 7);
    }
  );

export { numberValidated, textValidated, arrayValidated, objectValidated, passwordValidated, checkboxValidated, taiwanUBNValidation }

export default FieldConfig
