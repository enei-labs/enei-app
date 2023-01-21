import { Option } from '@core/types'
import type { AutocompleteProps, AutocompleteRenderInputParams } from '@mui/material/Autocomplete'
import Autocomplete from '@mui/material/Autocomplete'
import React from 'react'
import InputText from './InputText'

interface InputAutocompleteProps<
  T = Option,
  Multiple extends boolean | undefined = undefined,
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
  onChange?: (value: Option | null) => void
}

const InputAutocomplete = React.forwardRef<HTMLDivElement, InputAutocompleteProps>(
  function InputAutocomplete(props, ref) {
    const {
      label,
      value,
      options,
      loading,
      disabled,
      required,
      helperText,
      placeholder,
      renderInput,
      renderOption,
      onChange,
    } = props

    return (
      <Autocomplete
        fullWidth
        ref={ref}
        value={value || null}
        options={options || []}
        loading={loading}
        disabled={disabled}
        onChange={(event, value) => onChange?.(value)}
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
        renderOption={renderOption}
        isOptionEqualToValue={(option, value) => option.label === value.label}
      />
    )
  },
)

export type { InputAutocompleteProps }

export default InputAutocomplete
