import IconButton from "@mui/material/IconButton";
import type { Theme } from "@mui/material/styles";
import React from "react";

interface IconBtnProps {
  icon: React.ReactNode;
  onClick?: React.MouseEventHandler<HTMLButtonElement> | undefined;
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

const IconBtn: React.FC<IconBtnProps> = ({ icon, onClick }) => {
  return (
    <IconButton sx={style.wrapper} onClick={onClick}>
      {icon}
    </IconButton>
  );
};

export default IconBtn;
