import { Chip as MuiChip } from "@mui/material";

interface ChipProps {
  label: string;
  handleClick: VoidFunction;
  handleDelete: VoidFunction;
}

export default function Chip(props: ChipProps) {
  const { handleClick, handleDelete, label } = props;

  return (
    <MuiChip
      sx={{
        height: "40px",
        borderRadius: "4px",
        backgroundColor: "transparent",
        color: "primary.dark",
        border: "1px solid #004D40",
        fontSize: "14px",
        "& svg": {
          color: "#009688",
          "& :focus": {
            color: "#FFF",
          },
        },
        "&:hover": {
          backgroundColor: "#004D40",
          color: "#FFF",
        },
        "&:focus": {
          backgroundColor: "#009688",
          color: "#FFF",
        },
      }}
      label={label}
      onDelete={handleDelete}
      onClick={handleClick}
    />
  );
}
