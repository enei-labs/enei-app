import { AdapterDateFns } from '@mui/x-date-pickers/AdapterDateFns'
import type { DatePickerProps } from '@mui/x-date-pickers/DatePicker'
import { DatePicker } from '@mui/x-date-pickers/DatePicker'
import { LocalizationProvider } from '@mui/x-date-pickers/LocalizationProvider'
import { formatDateTime } from '@utils/format'
import React from 'react'
import InputText from './InputText'

interface InputDateProps
  extends Omit<DatePickerProps<any, any>, 'value' | 'renderInput' | 'onChange'> {
  value?: string
  required?: boolean
  helperText?: React.ReactNode
  onChange?: (value: any, keyboardInputValue?: string | undefined) => void
}

const InputDate = React.forwardRef<HTMLDivElement, InputDateProps>(function InputDate(props, ref) {
  const { label, value, required, helperText, onChange } = props

  const handleChange = (date: any) => {
    const value = formatDateTime(date)
    onChange?.(value)
  }

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        {...props}
        ref={ref}
        value={value || ''}
        onChange={handleChange}
        inputFormat="yyyy-MM-dd"
        renderInput={params => (
          <InputText
            {...params}
            ref={undefined}
            label={label}
            required={required}
            helperText={helperText}
          />
        )}
      />
    </LocalizationProvider>
  )
})

export default InputDate
