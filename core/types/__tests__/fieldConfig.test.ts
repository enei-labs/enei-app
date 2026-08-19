import * as yup from 'yup'
import { companyIdentifierValidation, taiwanUBNValidation } from '../fieldConfig'
import { CompanyType } from '@core/graphql/types'

const schema = yup.object().shape({ taxId: companyIdentifierValidation })
const isValid = (type: CompanyType | undefined, taxId: string) =>
  schema.isValidSync({ type, taxId })

describe('companyIdentifierValidation', () => {
  it('公司戶：合法統編通過、身分證格式不通過', () => {
    expect(isValid(CompanyType.Company, '22099131')).toBe(true)
    expect(isValid(CompanyType.Company, '12345678')).toBe(false)
    expect(isValid(CompanyType.Company, 'A123456789')).toBe(false)
  })

  it('個人戶：合法身分證/新式統一證號通過、統編格式不通過', () => {
    expect(isValid(CompanyType.Individual, 'A123456789')).toBe(true)
    expect(isValid(CompanyType.Individual, 'A800000014')).toBe(true)
    expect(isValid(CompanyType.Individual, 'A123456780')).toBe(false)
    expect(isValid(CompanyType.Individual, '22099131')).toBe(false)
  })

  it('type 未提供時視為公司戶（向下相容）', () => {
    expect(isValid(undefined, '22099131')).toBe(true)
    expect(isValid(undefined, 'A123456789')).toBe(false)
  })

  it('空值不通過（必填）', () => {
    expect(isValid(CompanyType.Company, '')).toBe(false)
    expect(isValid(CompanyType.Individual, '')).toBe(false)
  })

  it('既有 taiwanUBNValidation 行為不變（UserDialog 相依）', () => {
    expect(taiwanUBNValidation.isValidSync('22099131')).toBe(true)
    expect(taiwanUBNValidation.isValidSync('12345678')).toBe(false)
    expect(taiwanUBNValidation.isValidSync('')).toBe(false)
  })
})
