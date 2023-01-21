import * as yup from 'yup'
import { FieldController } from '.'
import Option from './option'

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
    | 'MOBILE'
    | 'ADDRESS'
    | 'COMPONENT'
    | 'ACCOUNT_TYPE'
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
  component?: React.ComponentType<FieldController>
}

const requiredMessage = 'This is required'

const textValidated = yup.string().required(requiredMessage)

const arrayValidated = yup.array().required(requiredMessage).min(1, requiredMessage)

const objectValidated = yup.mixed().notOneOf([undefined, null], requiredMessage)

const passwordValidated = yup
  .string()
  .required(requiredMessage)
  .matches(
    /^(?=.*[A-Za-z])(?=.*\d)[\w!#$%&()*+,-./:;<=>?@[\]^_`{|}~]{8,}$/,
    'Password must contain at least 8 characters with at least 1 number (0-9) and 1 alphabet.',
  )

const checkboxValidated = yup
  .boolean()
  .required(requiredMessage)
  .oneOf([true], 'Please check this box to proceed.')

export { textValidated, arrayValidated, objectValidated, passwordValidated, checkboxValidated }

export default FieldConfig
