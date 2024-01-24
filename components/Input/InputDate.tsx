import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { formatDateTime } from "@utils/format";
import React, { useState } from "react";
import InputText from "./InputText";

interface InputDateProps
  extends Omit<
    DatePickerProps<any, any>,
    "value" | "renderInput" | "onChange"
  > {
  value?: string;
  required?: boolean;
  helperText?: React.ReactNode;
  onChange?: (value: any, keyboardInputValue?: string | undefined) => void;
}

const InputDate = React.forwardRef<HTMLDivElement, InputDateProps>(
  function InputDate(props, ref) {
    const { label, value, required, helperText, onChange } = props;

    const handleChange = (date: any) => {
      const datePattern = /^\d{4}-\d{1,2}-\d{1,2}$/;
      let value;

      // If the date is already in a complete date format, use the formatDateTime function to format the date
      if (datePattern.test(date)) {
        value = formatDateTime(date);
      } else {
        // If the date is not in a complete date format, use the user's input directly
        value = date;
      }

      onChange?.(value);
    };

    return (
      <LocalizationProvider dateAdapter={AdapterDateFns}>
        <DatePicker
          {...props}
          ref={ref}
          value={value || ""}
          onChange={handleChange}
          inputFormat="yyyy-MM-dd"
          renderInput={(params) => (
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
  }
);

export default InputDate;
