import { Chip as MuiChip } from "@mui/material";

interface ChipProps {
  label: string;
  handleClick: VoidFunction;
  handleDelete?: VoidFunction;
  selected?: boolean;
}

export default function Chip(props: ChipProps) {
  const { handleClick, handleDelete, label, selected } = props;

  return (
    <MuiChip
      sx={{
        height: "40px",
        borderRadius: "4px",
        backgroundColor: selected ? "#009688" : "transparent",
        color: selected ? "#FFF" : "primary.dark",
        border: "1px solid",
        borderColor: selected ? "#009688" : "#004D40",
        fontSize: "14px",
        "& svg": {
          fill: selected ? "#FFF" : "#009688",
        },
        "&:hover": {
          backgroundColor: "#004D40",
          color: "#FFF",
          border: "1px solid #004D40",

          "& svg": {
            fill: "#FFF",
          },
        },
        "&:focus": {
          backgroundColor: "#009688",
          color: "#FFF",
          border: "1px solid #009688",
          "& svg": {
            fill: "#FFF",
          },
        },
      }}
      label={label}
      onDelete={handleDelete}
      onClick={handleClick}
    />
  );
}
