import InputText from "@components/Input/InputText";
import { Option } from "@core/types";
import Autocomplete, {
  AutocompleteRenderInputParams,
} from "@mui/material/Autocomplete";
import Box from "@mui/material/Box";
import Checkbox from "@mui/material/Checkbox";
import { CircularProgress, InputAdornment } from "@mui/material";
import { ControllerRenderProps } from "react-hook-form";

interface InputAutocompleteListProps {
  label?: React.ReactNode;
  options: Option[];
  required?: boolean;
  helperText?: React.ReactNode;
  placeholder?: string;
  onChange?: ControllerRenderProps["onChange"];
  onInputChange?: (value: string) => void; // 搜尋輸入變化回調
  filterOptions?: boolean; // 是否使用客戶端過濾
  loading?: boolean; // 是否正在載入
}

const style = {
  option: {
    height: "33px",
    padding: "0 !important",
  },
};

const InputAutocompleteList: React.FC<InputAutocompleteListProps> = ({
  label,
  options,
  required,
  helperText,
  placeholder,
  onChange,
  onInputChange,
  filterOptions = false,
  loading = false,
}) => {
  return (
    <Autocomplete
      multiple
      fullWidth
      options={options}
      disableCloseOnSelect
      loading={loading}
      loadingText={
        <div style={{ display: 'flex', alignItems: 'center', gap: '8px', padding: '8px' }}>
          <CircularProgress size="16px" />
          <span>搜尋中...</span>
        </div>
      }
      onChange={(event, newValue) => {
        if (onChange) {
          onChange(newValue);
        }
      }}
      onInputChange={(event, value, reason) => {
        // 當使用者輸入時觸發搜尋
        if (reason === "input") {
          onInputChange?.(value);
        }
      }}
      // 控制是否使用客戶端過濾（預設 false，使用伺服器端搜尋）
      filterOptions={filterOptions ? undefined : (x) => x}
      getOptionLabel={(option) => option.label}
      renderOption={(props, option, { selected }) => (
        <Box component="li" sx={style.option} {...props}>
          <Checkbox size="small" checked={selected} />
          {option.label}
        </Box>
      )}
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
    />
  );
};

export default InputAutocompleteList;
