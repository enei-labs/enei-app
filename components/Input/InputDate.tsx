import { AdapterDateFns } from "@mui/x-date-pickers/AdapterDateFns";
import { zhTW } from "date-fns/locale";
import type { DatePickerProps } from "@mui/x-date-pickers/DatePicker";
import { DatePicker } from "@mui/x-date-pickers/DatePicker";
import { LocalizationProvider } from "@mui/x-date-pickers/LocalizationProvider";
import { formatDateTime } from "@utils/format";
import { forwardRef } from "react";
import { Box, Typography } from "@mui/material";

const style = {
  text: [
    (theme: any) => ({
      display: "flex",
      gap: "10px",
      color: theme.palette.text.primary,
    }),
  ],
};

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
    // Check if newValue is a valid date before trying to use toISOString()
    let formattedValue = "";
    
    if (newValue && !isNaN(newValue.getTime())) {
      formattedValue = formatDateTime(newValue.toISOString());
    }
    
    onChange?.(newValue, formattedValue);
  };


  const labelName = (
    <Box sx={style.text}>
      {label}
      {required && <Typography color="error">*</Typography>}
    </Box>
  );


  return (
    <LocalizationProvider dateAdapter={AdapterDateFns} adapterLocale={zhTW}>
      <DatePicker
        {...otherProps}
        label={label && labelName}
        value={value ? new Date(value) : null}
        onChange={(newValue) => handleChange(newValue)}
        slotProps={{
          textField: {
            fullWidth: true,
            label: label && labelName,
            helperText,
            required: undefined,
            InputLabelProps: {
              shrink: true,
            },
          }
        }}
      />
    </LocalizationProvider>
  );
});

InputDate.displayName = "InputDate";
export default InputDate;
