import { Autocomplete } from '@mui/material'
import React from 'react'
import { InputAutocompleteProps } from './InputAutocomplete'
import InputText from './InputText'

interface InputSelectProps extends InputAutocompleteProps {
  onChange?: (value: any) => void
}

const style = {
  input: {
    '& .MuiOutlinedInput-root': {
      minWidth: '200px',
      height: '40px',
    },
  },
}

const InputSelect: React.FC<InputSelectProps> = props => {
  const { options, placeholder, onChange } = props

  return (
    <Autocomplete
      size="small"
      options={options || []}
      onChange={(event, option) => onChange?.(option?.value)}
      renderInput={params => <InputText {...params} sx={style.input} placeholder={placeholder} />}
    />
  )
}

export default InputSelect
