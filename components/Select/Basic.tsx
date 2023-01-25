import { MenuItem, TextField } from "@mui/material";
import { Dispatch, SetStateAction } from "react";

interface BasicSelectProps {
  state: string;
  setState: Dispatch<SetStateAction<string>>;
  items: {
    id: string;
    name: string;
  }[];
}

export function BasicSelect(props: BasicSelectProps) {
  const { state, setState, items } = props;

  return (
    <TextField
      value={state}
      onChange={(e) => setState(e.target.value)}
      sx={{ width: 260 }}
      select
      label="View By Status"
      size="small"
    >
      {(items ?? []).map((option) => (
        <MenuItem key={option.id} value={option.id}>
          {option.name}
        </MenuItem>
      ))}
    </TextField>
  );
}
