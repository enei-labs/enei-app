import { Tooltip } from "@mui/material";
import IconButton from "@mui/material/IconButton";
import type { Theme } from "@mui/material/styles";
import React from "react";

interface IconBtnProps {
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
  disabled?: boolean;
  tooltipText?: string;
}

const style = {
  wrapper: [
    (theme: Theme) => ({
      color: theme.palette.text.primary,
      "&:hover": {
        color: theme.palette.primary.main,
      },
    }),
  ],
};

const IconBtn: React.FC<IconBtnProps> = ({
  icon,
  onClick,
  disabled,
  tooltipText,
}) => {
  return (
    <Tooltip title={tooltipText}>
      <span>
        <IconButton sx={style.wrapper} onClick={onClick} disabled={disabled}>
          {icon}
        </IconButton>
      </span>
    </Tooltip>
  );
};

export default IconBtn;
