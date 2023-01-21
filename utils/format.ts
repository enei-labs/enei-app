import { isValid } from 'date-fns'
import dateFnsFormat from 'date-fns/format'

export const formatDateTime = (value?: string | number | Date, format = 'dd-MMM-yyyy') => {
  if (!value) return ''

  const number = Date.parse(value.toString())
  return isValid(number) ? dateFnsFormat(new Date(value), format) : ''
}
