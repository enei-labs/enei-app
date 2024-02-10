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
}

const RadioGroup = forwardRef<HTMLDivElement, RadioGroupProps>((props, ref) => {
  const { label, radios, row = false, ...field } = props;

  return (
    <FormControl ref={ref} size="small" sx={{ alignItems: "flex-start" }}>
      <FormLabel sx={{ fontSize: "14px" }}>{label}</FormLabel>
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
