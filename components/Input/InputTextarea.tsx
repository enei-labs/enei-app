import type { TextFieldProps } from '@mui/material'
import React from 'react'
import InputText from './InputText'

const InputTextarea = React.forwardRef<HTMLInputElement, TextFieldProps>(function InputTextarea(
  props,
  ref,
) {
  const { rows = 3, label, required, helperText } = props

  return (
    <InputText
      {...props}
      multiline
      ref={ref}
      rows={rows}
      label={label}
      required={required}
      helperText={helperText}
    />
  )
})
export default InputTextarea
