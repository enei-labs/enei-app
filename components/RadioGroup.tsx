import { forwardRef } from "react";
import {
  FormControl,
  FormControlLabel,
  FormLabel,
  RadioGroup as MuiRadioGroup,
  Radio,
  RadioGroupProps as MuiRadioGroupProps,
} from "@mui/material";

interface RadioGroupProps extends MuiRadioGroupProps {
  label: string;
  radios: {
    label: string;
    value: any;
  }[];
  row?: boolean;
  disabled?: boolean;
  required?: boolean;
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const { label, radios, row = false, required = false, ...field } = props;

  return (
    <FormControl ref={ref} size="small" sx={{ alignItems: "flex-start" }}>
      <FormLabel sx={{ fontSize: "14px" }}>
        {label}
        {required && <span style={{ 
          margin: 0,
          marginLeft: 10,
          fontSize: 14,
          fontWeight: 500,
          wordBreak: "break-all",
          fontFamily: "Roboto, Helvetica, Arial, sans-serif",
          lineHeight: 1.5,
          letterSpacing: 0.00938,
          color: "#f44336",
         }}>*</span>}
      </FormLabel>
      <MuiRadioGroup {...field} row={row}>
        {radios.map((radio) => (
          <FormControlLabel
            key={radio.value}
            sx={{
              "& .MuiFormControlLabel-label": { fontSize: "16px" },
            }}
            value={radio.value}
            control={<Radio size="small" />}
            label={radio.label}
            disabled={field.disabled}
          />
        ))}
      </MuiRadioGroup>
    </FormControl>
  );
});

RadioGroup.displayName = "RadioGroup";
export default RadioGroup;
