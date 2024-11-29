import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function InputSearch(props: {
  onChange?: (value: string) => void;
  onEnter?: () => void;
  placeholder?: string;
}) {
  const { onChange, onEnter, placeholder } = props;

  return (
    <TextField
      InputProps={{
        startAdornment: (
          <InputAdornment position="start">
            <SearchIcon />
          </InputAdornment>
        ),
      }}
      type="search"
      placeholder={placeholder || "搜尋(Enter)"}
      variant="outlined"
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
      onKeyDown={(e) => {
        if (e.key === "Enter") {
          onEnter?.();
        }
      }}
    />
  );
}

export default InputSearch;
