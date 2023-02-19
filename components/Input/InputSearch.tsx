import { InputAdornment, TextField } from "@mui/material";
import SearchIcon from "@mui/icons-material/Search";

function InputSearch(props: { onChange?: (value: string) => void }) {
  const { onChange } = props;

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
      placeholder="搜尋"
      variant="outlined"
      onChange={(e) => {
        onChange?.(e.target.value);
      }}
    />
  );
}

export default InputSearch;
