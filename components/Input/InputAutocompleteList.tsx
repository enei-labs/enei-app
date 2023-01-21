import { Option } from '@core/types'
import type { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material'
import Autocomplete from '@mui/material/Autocomplete'
import Box from '@mui/material/Box'
import Checkbox from '@mui/material/Checkbox'
import React from 'react'
import InputText from './InputText'

interface InputAutocompleteListProps<
  T = Option,
  Multiple extends boolean | undefined = true,
  FreeSolo extends boolean | undefined = undefined,
> extends Omit<
    AutocompleteProps<T, Multiple, any, FreeSolo>,
    'options' | 'renderInput' | 'onChange'
  > {
  label?: React.ReactNode
  options?: Option[]
  required?: boolean
  helperText?: React.ReactNode
  renderInput?: (params: AutocompleteRenderInputParams) => React.ReactNode
  onChange?: (value: Option<any>[]) => void
}

const style = {
  option: {
    height: '33px',
    p: '0 !important',
  },
}

const InputAutocompleteList = React.forwardRef<HTMLDivElement, InputAutocompleteListProps>(
  function InputAutocompleteList(props, ref) {
    const {
      label,
      value,
      options,
      disabled,
      required,
      helperText,
      placeholder,
      disableClearable,
      renderTags,
      renderInput,
      renderOption,
      getOptionDisabled,
      onChange,
    } = props

    return (
      <Autocomplete
        multiple
        fullWidth
        disableCloseOnSelect
        ref={ref}
        value={value || []}
        options={options || []}
        disabled={disabled}
        onChange={(event, value) => onChange?.(value)}
        renderTags={renderTags}
        renderInput={params =>
          renderInput?.(params) || (
            <InputText
              {...params}
              label={label}
              required={required}
              helperText={helperText}
              placeholder={placeholder}
            />
          )
        }
        renderOption={(props, option, state) => (
          <Box {...props} component="li" sx={style.option}>
            <Checkbox size="small" checked={state.selected} />
            {renderOption?.(props, option, state) || option.label}
          </Box>
        )}
        disableClearable={disableClearable}
        getOptionDisabled={getOptionDisabled}
        isOptionEqualToValue={(option, value) => option.label === value.label}
      />
    )
  },
)

export type { InputAutocompleteListProps }

export default InputAutocompleteList
