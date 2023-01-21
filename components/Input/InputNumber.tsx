import type { TextFieldProps } from '@mui/material'
import React from 'react'
import InputText from './InputText'

const InputNumber = React.forwardRef<HTMLInputElement, TextFieldProps>(function InputNumber(
  props,
  ref,
) {
  const { onChange } = props

  const handleWheel = (event: any) => {
    event.target.blur()
  }

  const handleChange = (value: any) => {
    const isEmpty = [undefined, null, ''].includes(value)
    onChange?.(!isEmpty ? +value : value)
  }

  return (
    <InputText {...props} ref={ref} type="number" onWheel={handleWheel} onChange={handleChange} />
  )
})

export default InputNumber
