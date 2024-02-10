import { Option } from "@core/types";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import TextField from "@mui/material/TextField";
import { forwardRef } from "react";

interface InputAutocompleteProps {
  label?: React.ReactNode;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  onChange?: (event: React.SyntheticEvent, value: Option | null) => void;
  disabled?: boolean;
}

const InputAutocomplete = forwardRef<HTMLDivElement, InputAutocompleteProps>(
  (props, ref) => {
    const {
      label,
      options,
      required,
      helperText,
      placeholder,
      onChange,
      ...otherProps
    } = props;

    return (
      <Autocomplete
        {...otherProps}
        options={options}
        getOptionLabel={(option) => option.label}
        onChange={onChange}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <TextField
            {...params}
            label={label}
            required={required}
            helperText={helperText}
            placeholder={placeholder}
            ref={ref}
          />
        )}
        isOptionEqualToValue={(option, value) => option.value === value.value}
      />
    );
  }
);

InputAutocomplete.displayName = "InputAutocomplete";
export default InputAutocomplete;
