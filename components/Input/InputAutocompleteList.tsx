import { Option } from '@core/types'
import Autocomplete, { AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import TextField from '@mui/material/TextField'
import React from 'react'

interface InputAutocompleteListProps {
  label?: React.ReactNode
  options: Option[]
  required?: boolean
  helperText?: React.ReactNode
  placeholder?: string
  onChange?: (value: Option[]) => void
}

const style = {
  option: {
    height: '33px',
    padding: '0 !important',
  },
}

const InputAutocompleteList: React.FC<InputAutocompleteListProps> = ({
  label,
  options,
  required,
  helperText,
  placeholder,
  onChange,
}) => {
  return (
    <Autocomplete
      multiple
      fullWidth
      options={options}
      disableCloseOnSelect
      onChange={(event, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option, { selected }) => (
        <Box component="li" sx={style.option} {...props}>
          <Checkbox size="small" checked={selected} />
          {option.label}
        </Box>
      )}
      renderInput={(params: AutocompleteRenderInputParams) => (
        <TextField
          {...params}
          label={label}
          required={required}
          helperText={helperText}
          placeholder={placeholder}
        />
      )}
    />
  );
};

export default InputAutocompleteList;
