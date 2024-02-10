import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { formatDateTime } from "@utils/format";
import { forwardRef } from "react";
import InputText from "@components/Input/InputText";

interface InputDateProps
  extends Omit<DatePickerProps<Date>, "value" | "onChange"> {
  value?: string;
  required?: boolean;
  helperText?: React.ReactNode;
  onChange?: (value: Date | null, keyboardInputValue?: string) => void;
}

const InputDate = forwardRef<HTMLDivElement, InputDateProps>((props, ref) => {
  const { label, value, required, helperText, onChange, ...otherProps } = props;

  const handleChange = (newValue: Date | null, keyboardInputValue?: string) => {
    let formattedValue = newValue ? formatDateTime(newValue.toISOString()) : "";
    onChange?.(newValue, formattedValue);
  };

  return (
    <LocalizationProvider dateAdapter={AdapterDateFns}>
      <DatePicker
        {...otherProps}
        label={label}
        value={value ? new Date(value) : null}
        onChange={(newValue) => handleChange(newValue)}
        slots={(params: any) => (
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
  );
});

InputDate.displayName = "InputDate";
export default InputDate;
