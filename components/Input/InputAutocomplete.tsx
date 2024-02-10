import InputText from "@components/Input/InputText";
import { Option } from "@core/types";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { forwardRef } from "react";
import { ControllerRenderProps } from "react-hook-form";

interface InputAutocompleteProps {
  label?: React.ReactNode;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  disabled?: boolean;
  onChange?: ControllerRenderProps["onChange"];
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
        onChange={(e, value) => {
          onChange?.(value);
        }}
        renderInput={(params: AutocompleteRenderInputParams) => (
          <InputText
            {...params}
            label={label}
            required={required}
            helperText={helperText}
            placeholder={placeholder}
          />
        )}
        noOptionsText={<div style={{ fontSize: "16px" }}>沒有資料</div>}
        isOptionEqualToValue={(option, value) => option.value === value.value}
        ref={ref}
      />
    );
  }
);

InputAutocomplete.displayName = "InputAutocomplete";
export default InputAutocomplete;
