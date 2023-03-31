import { Chip as MuiChip } from "@mui/material";

interface ChipProps {
  label: string;
  handleClick: VoidFunction;
  handleDelete: VoidFunction;
}

export default function Chip(props: ChipProps) {
  const { handleClick, handleDelete, label } = props;

  return (
    <MuiChip label={label} onDelete={handleDelete} onClick={handleClick} />
  );
}
