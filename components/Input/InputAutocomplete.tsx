import InputText from "@components/Input/InputText";
import { Option } from "@core/types";
import { CircularProgress, InputAdornment } from "@mui/material";
import Autocomplete, {
  AutocompleteRenderInputParams,
  createFilterOptions,
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
  onInputChange?: (value: string) => void; // 搜尋輸入變化回調
  filterOptions?: boolean; // 是否使用客戶端過濾，預設 false（使用伺服器端搜尋）
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
      onInputChange,
      filterOptions = false,
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
          loadingText={
            <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
              <CircularProgress size="16px" />
              <span>搜尋中...</span>
            </div>
          }
          getOptionLabel={(option) => option.label}
          onChange={(e, value) => {
            onChange?.(value);
          }}
          onInputChange={(event, value, reason) => {
            // 當使用者輸入時觸發搜尋
            if (reason === "input") {
              onInputChange?.(value);
            }
          }}
          // 控制是否使用客戶端過濾（預設 false，使用伺服器端搜尋）
          filterOptions={filterOptions ? createFilterOptions() : undefined}
          renderInput={(params: AutocompleteRenderInputParams) => (
            <InputText
              {...params}
              label={label}
              required={required}
              helperText={helperText}
              placeholder={placeholder}
              InputProps={{
                ...params.InputProps,
                endAdornment: (
                  <>
                    {loading && (
                      <InputAdornment position="end" sx={{ mr: 1 }}>
                        <CircularProgress size={20} />
                      </InputAdornment>
                    )}
                    {params.InputProps.endAdornment}
                  </>
                ),
              }}
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
