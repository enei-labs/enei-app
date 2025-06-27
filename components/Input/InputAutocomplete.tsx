import InputText from "@components/Input/InputText";
import { Option } from "@core/types";
import { CircularProgress } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import { CSSProperties, forwardRef, UIEventHandler } from "react";
import { ControllerRenderProps } from "react-hook-form";
import { createTheme, ThemeProvider } from "@mui/material";

interface InputAutocompleteProps {
  label?: React.ReactNode;
  options: Option[];
  required?: boolean;
  placeholder?: string;
  helperText?: React.ReactNode;
  disabled?: boolean;
  onChange?: ControllerRenderProps["onChange"];
  loading?: boolean;
  fetchMoreData?: () => void;
  sx?: CSSProperties;
}

const theme = createTheme({
  components: {
    MuiAutocomplete: {
      styleOverrides: {
        noOptions: {
          fontSize: "16px",
        },
        listbox: {
          maxHeight: "250px",
          overflow: "auto",
        },
      },
    },
  },
});

const InputAutocomplete = forwardRef<HTMLDivElement, InputAutocompleteProps>(
  (props, ref) => {
    const {
      label,
      options,
      required,
      helperText,
      placeholder,
      onChange,
      loading,
      fetchMoreData,
      ...otherProps
    } = props;

    const handleScroll: UIEventHandler<HTMLUListElement> = async (event) => {
      const listboxNode = event.currentTarget;

      if (
        fetchMoreData &&
        listboxNode.scrollTop + listboxNode.clientHeight + 10 >=
          listboxNode.scrollHeight
      ) {
        await fetchMoreData();
        listboxNode.scrollTop = listboxNode.scrollHeight;
      }
    };

    return (
      <ThemeProvider theme={theme}>
        <Autocomplete
          {...otherProps}
          options={options}
          loading={loading}
          loadingText={<CircularProgress size="16px" />}
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
          ListboxProps={{
            onScroll: handleScroll,
          }}
          noOptionsText={"沒有資料"}
          isOptionEqualToValue={(option, value) => option.value === value?.value}
          ref={ref}
          getOptionKey={(option) => `${option.value}-${option.label}`}
          getOptionDisabled={(option) =>
            typeof option.disabled === "boolean" && option.disabled
          }
        />
      </ThemeProvider>
    );
  }
);

InputAutocomplete.displayName = "InputAutocomplete";
export default InputAutocomplete;
