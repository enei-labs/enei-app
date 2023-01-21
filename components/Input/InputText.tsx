import type { TextFieldProps } from '@mui/material'
import Box from '@mui/material/Box'
import TextField from '@mui/material/TextField'
import Typography from '@mui/material/Typography'
import React from 'react'

const style = {
  text: [
    (theme: any) => ({
      display: 'flex',
      gap: '10px',
      color: theme.palette.text.primary,
    }),
  ],
}

const InputText = React.forwardRef<HTMLInputElement, TextFieldProps>(function InputText(
  props,
  ref,
) {
  const { label, value, required, helperText, onChange } = props

  const handleChange = (event: any) => {
    onChange?.(event.target.value)
  }

  const labelName = (
    <Box sx={style.text}>
      {label}
      {required && <Typography color="error">*</Typography>}
    </Box>
  )

  return (
    <TextField
      {...props}
      fullWidth
      ref={ref}
      label={label && labelName}
      value={value === 0 ? 0 : value || ''}
      error={!!helperText}
      required={undefined}
      onChange={handleChange}
      InputLabelProps={{ shrink: true }}
    />
  )
})

export default InputText
