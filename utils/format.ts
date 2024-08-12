import { parseISO, format } from 'date-fns'

export const formatDateTime = (value?: string | number | Date, dateFormat = 'yyyy-MM-dd') => {
  if (!value) return ''

  const date = (typeof value === 'string' && !isNaN(Date.parse(value))) ? parseISO(value) : new Date(value)

  return format(date, dateFormat)
}

export function formatNumber(value: number): string {
  return Math.round(value).toLocaleString('en-US');
}