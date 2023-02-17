import type { TooltipProps } from "@mui/material";
import MuiTooltip from "@mui/material/Tooltip";
import React from "react";

interface IconTooltip extends Omit<TooltipProps, "children"> {
  icon: React.ComponentType<any>;
}

const style = {
  icon: {
    fontSize: "10px",
  },
};

const IconTooltip: React.FC<IconTooltip> = ({ icon: Icon, sx, ...props }) => {
  return (
    <MuiTooltip arrow {...props}>
      <Icon color="menu" sx={sx || style.icon} />
    </MuiTooltip>
  );
};

export default IconTooltip;
